var _uuid = require('node-uuid');
var MysqlDao = require('../dao/mysqlDao.js');
var ProductDAO = require('../dao/productDao.js');
var BrandDAO = require('../dao/brandDao.js');

function ProductModel(){
    this.dao = new MysqlDao();
    this.dao.init();
    this.productDao = new ProductDAO(this.dao);
    this.brandDao = new BrandDAO(this.dao);

    this.insert = function(uuid, name, description, unitPrice, profit, sellPrice, tax, measure, brand, group, nacionality, barCode, stock, res){
        var self = this;

        //Check valid data
        unitPrice = parseFloat(unitPrice.toString().replace(",", "."));
        tax = parseFloat(tax.toString().replace(",", "."));

        if(uuid == "") uuid = _uuid.v4();
        if(name == "") {
            res.send({status: 1, error: 'Invalid product name.'});
            return;
        }

        if(unitPrice == null || unitPrice == "") {
            res.send({status: 1, error: 'Invalid unit price.'});
            return false;
        }

        if(profit == "" || profit == null) profit = 0;
        else profit = parseFloat(profit.toString().replace(",", "."));
        if(profit < 0){
            res.send({status: 1, error: 'Invalid profit range. Insert a profit in percent ( >= 0 )'});
            return false;
        }

        if(isNaN(sellPrice) && sellPrice != null) {
            res.send({status: 1, error: 'Sell price must be null or a number.'});
            return false;
        } else if(sellPrice == null || sellPrice == "") sellPrice = unitPrice + (unitPrice * (profit / 100));
        else sellPrice = parseFloat(sellPrice.toString().replace(",", "."));

        if(tax == "") tax = 0;
        if(tax < 0 || tax > 100){
            res.send({status: 1, error: 'Invalid tax range. Insert a tax in percent (0 ~ 100)'});
            return false;
        }

        if(measure == "") {
            res.send({status: 1, error: 'Invalid measure.'});
            return;
        }

        if(!stock || stock == "") stock = 0;

        this.brandDao.getByUuid(brand, function(err, brand){
            if(err !== null || brand === null) {
                res.send({status: 1, error: 'Brand not found.'});
                return false;
            }

            var product = {};
            product.uuid = uuid;
            product.name = name;
            product.description = description;
            product.unitPrice = unitPrice;
            product.profit = profit;
            product.sellPrice = sellPrice;
            product.tax = tax;
            product.measure = measure;
            product.brand = brand.uuid;
            product.group = group;
            product.nacionality = nacionality;
            product.barCode = barCode;
            product.stock = stock;

            self.productDao.insert(product, function(err, rows){
                if(!err){
                    res.send({status: 0, message: 'Product inserted.'});
                    return true;
                } else {
                    res.send({status: 1, error: 'Product not inserted.'});
                    return false;
                }
            });
        });
    };

    this.update = function(uuid, name, description, unitPrice, profit, sellPrice, tax, measure, brand, group, nacionality, barCode, stock, res){
        var self = this;

        //Check valid data
        unitPrice = parseFloat(unitPrice.toString().replace(",", "."));
        tax = parseFloat(tax.toString().replace(",", "."));

        if(uuid == "") {
            res.send({status: 1, error: 'Invalid product uuid.'});
            return;
        }

        if(!name || name == "") {
            res.send({status: 1, error: 'Invalid product name.'});
            return;
        }

        if(!unitPrice || unitPrice == "") {
            res.send({status: 1, error: 'Invalid unit price.'});
            return false;
        }
        if(!profit || profit == "") profit = 0;
        else profit = parseFloat(profit.toString().replace(",", "."));
        if(profit < 0){
            res.send({status: 1, error: 'Invalid profit range. Insert a profit in percent ( >= 0 )'});
            return false;
        }

        if(isNaN(sellPrice) && sellPrice != null) {
            res.send({status: 1, error: 'Sell price must be null or a number.'});
            return false;
        } else if(sellPrice == null || sellPrice == "") sellPrice = unitPrice + (unitPrice * (profit / 100));
        else sellPrice = parseFloat(sellPrice.toString().replace(",", "."));

        if(tax == "") tax = 0;
        if(tax < 0 || tax > 100){
            res.send({status: 1, error: 'Invalid tax range. Insert a tax in percent (0 ~ 100)'});
            return false;
        }

        if(isNaN(measure)) {
            res.send({status: 1, error: 'Measure must be a number.'});
            return;
        }

        if(!stock || stock == "") stock = 0;

        this.productDao.getByUuid(uuid, function(err, product){
            if(err !== null || product === null){
                res.send({status: 1, error: 'Product not found.'});
                return false;
            }

            self.brandDao.getByUuid(brand, function(err, brand){
                if(err !== null || brand === null) {
                    res.send({status: 1, error: 'Brand not found.'});
                    return false;
                }

                var product = {};
                product.uuid = uuid;
                product.name = name;
                product.description = description;
                product.unitPrice = unitPrice;
                product.profit = profit;
                product.sellPrice = sellPrice;
                product.tax = tax;
                product.measure = measure;
                product.brand = brand.uuid;
                product.group = group;
                product.nacionality = nacionality;
                product.barCode = barCode;
                product.stock = stock;

                self.productDao.update(product, function(err, rows){
                    if(!err){
                        res.send({status: 0, message: 'Product updated.'});
                        return true;
                    } else {
                        res.send({status: 1, error: 'Internal error.'});
                        return false;
                    }
                });
            });
        });
    };

    this.list = function(res){
        this.productDao.getAll(function(err, rows){
            if(!err){
                if(rows){
                    var products = [];
                    for(var i = 0; i < rows.length; i++){
                        var brand = {
                            uuid: rows[i].uuid,
                            name: rows[i].brandName
                        };

                        var product = {};
                        product.uuid = rows[i].uuid;
                        product.productName = rows[i].productName;
                        product.description = rows[i].description;
                        product.unitPrice = rows[i].unitPrice;
                        product.profit = rows[i].profit;
                        product.sellPrice = rows[i].sellPrice;
                        product.tax = rows[i].tax;
                        product.measure = rows[i].measure;
                        product.brand = brand;
                        product.productGroup = rows[i].productGroup;
                        product.nacionality = rows[i].nacionality;
                        product.barCode = rows[i].barCode;
                        product.stock = rows[i].stock;

                        products.push(product);
                    }

                    res.send({status: 0, products: products});
                    return true;
                } else {
                    res.send({status: 0, products: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    };

    this.getActived = function(res){
        this.productDao.getActived(function(err, rows){
            if(!err){
                if(rows){
                    var products = [];
                    for(var i = 0; i < rows.length; i++){
                        var brand = {
                            uuid: rows[i].uuid,
                            name: rows[i].brandName
                        };

                        var product = {};
                        product.uuid = rows[i].uuid;
                        product.productName = rows[i].productName;
                        product.description = rows[i].description;
                        product.unitPrice = rows[i].unitPrice;
                        product.profit = rows[i].profit;
                        product.sellPrice = rows[i].sellPrice;
                        product.tax = rows[i].tax;
                        product.measure = rows[i].measure;
                        product.brand = brand;
                        product.productGroup = rows[i].productGroup;
                        product.nacionality = rows[i].nacionality;
                        product.barCode = rows[i].barCode;
                        product.stock = rows[i].stock;

                        products.push(product);
                    }

                    res.send({status: 0, products: products});
                    return true;
                } else {
                    res.send({status: 0, products: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    };

    this.getByUuid = function(uuid, res){
        var self = this;
        if(!uuid) {
            res.send({statis: 1, error: 'Invalid uuid.'});
            return false;
        }

        this.productDao.getByUuid(uuid, function(err, product){
            if(!err){
                if(!product){
                    res.send({status: 1, error: 'Product not found.'});
                    return false;
                } else {
                    self.brandDao.getByUuid(product.brand, function(err, brand){
                        if(!err){
                            if(!brand){
                                res.send({status: 1, error: 'Brand not found.'});
                                return false;
                            } else {
                                product.brand = brand;
                                res.send({status: 0, product: product});
                                return true;
                            }
                        } else {
                            res.send({status: 1, error: 'Internal error.'});
                            return false;
                        }
                    });
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    }

    this.getByName = function(name, res){
        this.productDao.getByName(name, function(err, rows){
            if(!err){
                if(rows){
                    var products = [];
                    for(var i = 0; i < rows.length; i++){
                        var brand = {
                            uuid: rows[i].uuid,
                            name: rows[i].brandName
                        };

                        var product = {};
                        product.uuid = rows[i].uuid;
                        product.productName = rows[i].productName;
                        product.description = rows[i].description;
                        product.unitPrice = rows[i].unitPrice;
                        product.profit = rows[i].profit;
                        product.sellPrice = rows[i].sellPrice;
                        product.tax = rows[i].tax;
                        product.measure = rows[i].measure;
                        product.brand = brand;
                        product.productGroup = rows[i].productGroup;
                        product.nacionality = rows[i].nacionality;
                        product.barCode = rows[i].barCode;
                        product.stock = rows[i].stock;

                        products.push(product);
                    }

                    res.send({status: 0, products: products});
                    return true;
                } else {
                    res.send({status: 0, products: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    };

    this.getByBrand = function(brand, res){
        this.productDao.getByBrand(brand, function(err, rows){
            if(!err){
                if(rows){
                    var products = [];
                    for(var i = 0; i < rows.length; i++){
                        var brand = {
                            uuid: rows[i].uuid,
                            name: rows[i].brandName
                        };

                        var product = {};
                        product.uuid = rows[i].uuid;
                        product.productName = rows[i].productName;
                        product.description = rows[i].description;
                        product.unitPrice = rows[i].unitPrice;
                        product.profit = rows[i].profit;
                        product.sellPrice = rows[i].sellPrice;
                        product.tax = rows[i].tax;
                        product.measure = rows[i].measure;
                        product.brand = brand;
                        product.productGroup = rows[i].productGroup;
                        product.nacionality = rows[i].nacionality;
                        product.barCode = rows[i].barCode;
                        product.stock = rows[i].stock;

                        products.push(product);
                    }

                    res.send({status: 0, products: products});
                    return true;
                } else {
                    res.send({status: 0, products: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    };

    this.getByBarCode = function(barcode, res){
        this.productDao.getByBarCode(barcode, function(err, rows){
            if(!err){
                if(rows){
                    var products = [];
                    for(var i = 0; i < rows.length; i++){
                        var brand = {
                            uuid: rows[i].uuid,
                            name: rows[i].brandName
                        };

                        var product = {};
                        product.uuid = rows[i].uuid;
                        product.productName = rows[i].productName;
                        product.description = rows[i].description;
                        product.unitPrice = rows[i].unitPrice;
                        product.profit = rows[i].profit;
                        product.sellPrice = rows[i].sellPrice;
                        product.tax = rows[i].tax;
                        product.measure = rows[i].measure;
                        product.brand = brand;
                        product.productGroup = rows[i].productGroup;
                        product.nacionality = rows[i].nacionality;
                        product.barCode = rows[i].barCode;
                        product.stock = rows[i].stock;

                        products.push(product);
                    }

                    res.send({status: 0, products: products});
                    return true;
                } else {
                    res.send({status: 0, products: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    };

    this.listNacionalities = function(res){
        this.productDao.getAllNacionalities(function(err, rows){
            if(!err){
                if(rows){
                    res.send({status: 0, nacionalities: rows});
                    return true;
                } else {
                    res.send({status: 1, error: 'Internal error.'});
                    return false;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    }
}

module.exports = ProductModel;
