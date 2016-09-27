var SaleModel = require('../../models/saleModel.js');
var saleModel = new SaleModel();

module.exports = {
    '/sales/new': {
        post: function(req, res, cb) {
            saleModel.new(req.body.token, req.body.products, req.body.saleOff, res);
            return cb();
        }
    },
    '/sales/addPayment': {
        post: function(req, res, cb) {
            saleModel.addPayment(req.body.sale, req.body.type, req.body.payment, res);
            return cb();
        }
    },
    '/sales/details/:uuid': {
        get: function(req, res, cb){
            saleModel.getByUuid(req.params.uuid, res);
            return cb();
        }
    }
};
