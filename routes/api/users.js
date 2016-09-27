var UserModel = require('../../models/userModel.js');
var userModel = new UserModel();

module.exports = {
    '/user/login': {
        post: function(req, res, cb) {
            userModel.login(req.body.username, req.body.password, res);
            return cb();
        }
    },
    '/user/insert': {
        post: function(req, res, cb){
            userModel.insert(req.body.username, req.body.password, req.body.name, res);
            return cb();
        }
    },
    '/user/changePassword': {
        post: function(req, res, cb){
            userModel.changePassword(req.body.username, req.body.oldPassword, req.body.newPassword, res);
        }
    },
    '/user/list': {
        get: function(req, res, cb){
            userModel.getAll(res);
        }
    }
};
