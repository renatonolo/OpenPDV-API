var ProductModel = require('../../models/productModel.js');
var productModel = new ProductModel();

module.exports = {
    '/products/insert': {
        post: function(req, res, cb) {
            productModel.insert(
                "",
                req.body.productName,
                req.body.description,
                req.body.unitPrice,
                req.body.profit,
                req.body.sellPrice,
                req.body.tax,
                req.body.measure,
                req.body.brand,
                req.body.productGroup,
                req.body.nacionality,
                req.body.barCode,
                req.body.stock,
                res
            );
            return cb();
        }
    },
    '/products/update': {
        post: function(req, res, cb){
            productModel.update(
                req.body.uuid,
                req.body.productName,
                req.body.description,
                req.body.unitPrice,
                req.body.profit,
                req.body.sellPrice,
                req.body.tax,
                req.body.measure,
                req.body.brand,
                req.body.productGroup,
                req.body.nacionality,
                req.body.barCode,
                req.body.stock,
                res
            );
        }
    },
    '/products': {
        get: function(req, res, cb){
            productModel.list(res);
        }
    },
    '/products/activated': {
        get: function(req, res, cb){
            productModel.getActived(res);
        }
    },
    '/products/uuid/:uuid': {
        get: function(req, res, cb){
            productModel.getByUuid(req.params.uuid, res);
        }
    },
    '/products/name/:name': {
        get: function(req, res, cb){
            productModel.getByName(req.params.name, res);
        }
    },
    '/products/brand/:uuid': {
        get: function(req, res, cb){
            productModel.getByBrand(req.params.uuid, res);
        }
    },
    '/products/barcode/:barcode': {
        get: function(req, res, cb){
            productModel.getByBarCode(req.params.barcode, res);
        }
    }
};
