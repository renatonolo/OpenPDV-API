var _uuid = require('node-uuid');
var MysqlDao = require('../dao/mysqlDao.js');
var UserDao = require('../dao/userDao.js');

function UserModel(){
    this.dao = new MysqlDao();
    this.dao.init();
    this.userDao = new UserDao(this.dao);

    this.login = function(username, password, res){
        var self = this;

        this.userDao.getByUsername(username, function(err, user){
            if(err == null){
                if(user !== null && user.password == password){
                    user.token = _uuid.v4();
                    user.last_login = new Date().getTime();

                    self.userDao.update(user);

                    res.send(
                        {
                            status: 0,
                            data: {
                                token: user.token,
                                name: user.name,
                                username: user.username,
                                last_login: user.last_login
                            }
                        }
                    );
                } else res.send({status: 1, error: 'Invalid username or password.'});
                return;
            } else res.send({status: 1, error: 'Internal error.'});
        });
    };

    this.insert = function(username, password, name, res){
        if(username == "") {
            res.send({status: 1, error: 'Username is empty.'});
            return false;
        }
        if(password == "") {
            res.send({status: 1, error: 'Password is empty.'});
            return false;
        }

        var self = this;

        this.userDao.getByUsername(username, function(err, rows){
            if(err == null){
                if(rows !== null) res.send({status: 1, error: 'Username already exists. Please try other username.'});
                else {
                    var user = {
                        uuid: _uuid.v4(),
                        username: username,
                        password: password,
                        name: name,
                        token: '',
                        last_login: 0
                    };

                    self.userDao.insert(user, function(err, user){
                        if(err == null) res.send({status: 0, message:'User inserted.'});
                        else res.send({status: 1, error: 'Internal error.'});

                        return;
                    });
                }
            } else res.send({status: 1, error: 'Internal error.'});
        });
    };

    this.changePassword = function(username, oldPassword, newPassword, res){
        if(username == "") {
            res.send({status: 1, error: 'Username is empty.'});
            return false;
        }
        if(oldPassword == "") {
            res.send({status: 1, error: 'Old password is empty.'});
            return false;
        }
        if(newPassword == "" || newPassword.length < 6){
            res.send({status: 1, error: 'Invalid new password.'});
            return false;
        }

        var self = this;

        this.userDao.getByUsername(username, function(err, row){
            if(err == null){
                if(row !== null && row.password == oldPassword){
                    var user = {
                        uuid: row.uuid,
                        username: username,
                        password: newPassword,
                        name: row.name,
                        token: row.token,
                        last_login: row.last_login
                    };

                    self.userDao.update(user, function(err, row){
                        if(!err) res.send({status: 0, message: 'Password changed.'});
                        else res.send({status: 1, message: 'Internal error.'});
                        return;
                    });
                } else res.send({status: 1, error: 'Username or password invalid.'});
            } else res.send({status: 1, error: 'Internal error.'});
        });
    };

    this.checkToken = function(token, res, next){
        if(!token || token == ""){
            res.send({status: 1, error: 'Invalid user token.'});
            return false;
        }

        this.userDao.getByToken(token, function(err, rows){
            if(!err && rows){
                console.log("Valid user: " + rows.username);
                return next();
            } else {
                res.send({status: 1, error: 'Invalid user token.'});
                return false;
            }
        });
    };

    this.getAll = function(res){
        this.userDao.getAll(function(err, users){
            if(err) {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            } else {
                res.send({status: 0, users: users});
                return true;
            }
        })
    }
}

module.exports = UserModel;
