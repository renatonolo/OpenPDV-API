var BrandModel = require('../../models/brandModel.js');
var brandModel = new BrandModel();

module.exports = {
    '/brands/insert': {
        post: function(req, res, cb) {
            brandModel.insert(
                "",
                req.body.name,
                req.body.status,
                res
            );
            return cb();
        }
    },
    '/brands/update': {
        post: function(req, res, cb) {
            brandModel.update(
                req.body.uuid,
                req.body.name,
                req.body.status,
                res
            );
            return cb();
        }
    },
    '/brands/deactivate': {
        post: function(req, res, cb) {
            brandModel.deactive(
                req.body.uuid,
                res
            );
            return cb();
        }
    },
    '/brands/activate': {
        post: function(req, res, cb) {
            brandModel.active(
                req.body.uuid,
                res
            );
            return cb();
        }
    },
    '/brands': {
        get: function(req, res, cb){
            brandModel.list(res);
            return cb();
        }
    },
    '/brands/uuid/:uuid': {
        get: function(req, res, cb){
            brandModel.getByUuid(req.params.uuid, res);
        }
    },
    '/brands/name/:name': {
        get: function(req, res, cb){
            brandModel.getByName(req.params.name, res);
        }
    }
};
