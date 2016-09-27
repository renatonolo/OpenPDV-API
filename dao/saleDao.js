var _uuid = require('node-uuid');
var mysql = require('mysql');

function SaleDAO(db){
    this.db = db;

    this.getByUuid = function(uuid, callback){
        if(!uuid) return false;
        var self = this;
        var sql = "SELECT * FROM sales WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, sale, fields){
            if(err) callback(err, null);
            else if(sale.length == 1) {
                sql = "SELECT p.*, sp.amount, sp.value, sp.productOff FROM products AS p INNER JOIN sale_products AS sp ON p.uuid = sp.product WHERE sp.sale = '" + uuid + "'";
                self.db.query(sql, function(err, rows, fields){
                    if(rows.length > 0) sale[0].products = rows;
                    else sale[0].products = null;
                    callback(null, sale[0]);
                });
            } else if(sale.length == 0) callback(null, null);
        });
    };

    this.insert = function(sale, callback){
        if(!sale || !sale.uuid || sale.uuid == '') return false;

        var sql = "INSERT INTO sales (uuid, user, saleOff, date) VALUES ('" + sale.uuid + "', '" + sale.user + "', " + sale.saleOff + ", " + sale.date + ")";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.insertProductOnSale = function(sale, products, callback){
        var self = this;
        if(!sale || sale == "") return false;
        if(!products || products.length == 0) return false;

        var sql = "", sql2 = "";

        for(var i = 0; i < products.length; i++){
            sql += "SELECT productName, sellPrice, stock FROM products WHERE uuid = '" + products[i].uuid + "'; ";
        }

        this.db.query(sql, function(err, rows){
            sql = "INSERT INTO sale_products (uuid, sale, product, amount, value, productOff) VALUES ?";

            var values = [], values2 = [];
            var saleValue = 0;

            for(var i = 0; i < products.length; i++){
                if(products.length > 1){
                    if((rows[i][0].stock - products[i].amount) < 0) {
                        callback("Error: product '" + products[i].productName + "' out of stock.");
                        return;
                    }
                } else {
                    if((rows[0].stock - products[0].amount) < 0) {
                        callback("Error: product '" + products[i].productName + "' out of stock.");
                        return;
                    }
                }

                if(products.length > 1) var val = rows[i][0].sellPrice * products[i].amount;
                else var val = rows[0].sellPrice * products[i].amount;
                var value = [_uuid.v4(), sale, products[i].uuid, products[i].amount, val, products[i].productOff];
                saleValue += val;
                values.push(value);

                if(products.length > 1) var value2 = [(rows[i][0].stock - products[i].amount), products[i].uuid];
                else var value2 = [(rows[0].stock - products[i].amount), products[i].uuid];
                values2.push(value2);
            }

            values2.forEach(function(item){
                sql2 += mysql.format("UPDATE products SET stock = ? WHERE uuid = ?; ", item);
            });

            self.db.multipleQuery(sql, values, function(err){
                if(err) callback(err);
                else {
                    self.db.query(sql2, function(err){
                        if(err) callback(err);
                        else {
                            sql = mysql.format("UPDATE sales SET value = ? WHERE uuid = ?", [saleValue, sale]);
                            self.db.query(sql, function(err){
                                if(err) callback(err);
                                else callback(null);
                            });
                            callback(null);
                        }
                    });
                }
            });
        });
    };

    this.getByDateRange = function(start, end, page, callback){
        var sAux = start.replace('-', '/') + " 00:00:00";
        var s = new Date(sAux).getTime();
        var eAux = end.replace('-', '/') + " 23:59:59";
        var e = new Date(eAux).getTime();

        var limit = " LIMIT 20 OFFSET " + page * 20;

        var sql = mysql.format("SELECT u.name, s.* FROM sales AS s INNER JOIN users AS u ON s.user = u.uuid WHERE date >= ? AND date <= ? ORDER BY date " + limit, [s, e]);
        
        this.db.query(sql, function(err, rows){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };
}

module.exports = SaleDAO;
