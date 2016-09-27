function ProductDAO(db){
    this.db = db;

    this.insert = function(product, callback){
        if(!product.uuid) return false;

        var sql = "INSERT INTO products ( " +
        "uuid, productName, description, unitPrice, profit, sellPrice, tax, " +
        "measure, brand, productGroup, nacionality, barCode, stock) VALUES ( " +
        "'" + product.uuid + "', '" + product.name + "', '" + product.description + "', " +
        product.unitPrice + ", " + product.profit + ", " + product.sellPrice + ", " +
        product.tax + ", " + product.measure + ", '" + product.brand + "', " +
        "'" + product.group + "', '" + product.nacionality + "', " + product.barCode + ", " +
        product.stock + ")";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, product);
        });
    };

    this.update = function(product, callback){
        if(!product.uuid) return false;

        var sql = "UPDATE products SET " +
        "productName = '" + product.name + "', description = '" + product.description + "', " +
        "unitPrice = " + product.unitPrice + ", profit = " + product.profit + ", " +
        "sellPrice = " + product.sellPrice + ", tax = " + product.tax + ", " +
        "measure = " + product.measure + ", brand = '" + product.brand + "', " +
        "productGroup = '" + product.group + "', nacionality = '" + product.nacionality + "', " +
        "barCode = " + product.barCode + ", stock = " + product.stock +
        " WHERE uuid = '" + product.uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, product);
        });
    };

    this.getByUuid = function(uuid, callback){
        if(!uuid) return false;

        var sql = "SELECT * FROM products WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0) callback(null, null);
        });
    };

    this.getAll = function(callback){
        var sql = "SELECT p.*, b.name AS brandName FROM products AS p INNER JOIN brands AS b ON p.brand = b.uuid ORDER BY productName";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.getActived = function(callback){
        var sql = "SELECT p.*, b.name AS brandName FROM products AS p INNER JOIN brands AS b ON p.brand = b.uuid WHERE b.status = 1 ORDER BY productName";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.getByName = function(name, callback){
        var sql = "SELECT p.*, b.name AS brandName FROM products AS p INNER JOIN brands AS b ON p.brand = b.uuid WHERE p.productName LIKE '%" + name + "%' ORDER BY productName";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.getByBrand = function(brand, callback){
        var sql = "SELECT p.*, b.name AS brandName FROM products AS p INNER JOIN brands AS b ON p.brand = b.uuid WHERE p.brand = '" + brand + "' ORDER BY productName";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.getByBarCode = function(barcode, callback){
        var sql = "SELECT p.*, b.name AS brandName FROM products AS p INNER JOIN brands AS b ON p.brand = b.uuid WHERE p.barcode LIKE '" + barcode + "%' ORDER BY productName";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.getAllNacionalities = function(callback){
        var sql = "SELECT * FROM countries ORDER BY id";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    }
}

module.exports = ProductDAO;
