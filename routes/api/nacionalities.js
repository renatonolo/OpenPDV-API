var ProductModel = require('../../models/productModel.js');
var productModel = new ProductModel();

module.exports = {
    '/nacionalities': {
        get: function(req, res, cb){
            productModel.listNacionalities(res);
        }
    }
};
