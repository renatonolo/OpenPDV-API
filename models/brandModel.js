var _uuid = require('node-uuid');
var MysqlDao = require('../dao/mysqlDao.js');
var BrandDAO = require('../dao/brandDao.js');

function BrandModel(){
    this.dao = new MysqlDao();
    this.dao.init();
    this.brandDao = new BrandDAO(this.dao);

    this.insert = function(uuid, name, status, res){
        var self = this;

        //Check valid data
        if(uuid == "") uuid = _uuid.v4();
        if(name == "") {
            res.send({status: 1, error: 'Invalid brand name.'});
            return;
        }
        if(!status) status = 1;

        this.brandDao.getByName(name, function(err, brand){
            if(brand !== null) {
                res.send({status: 1, error: 'Brand already exists.'});
                return false;
            }

            var brand = {};
            brand.uuid = uuid;
            brand.name = name;
            brand.status = status;

            self.brandDao.insert(brand, function(err, rows){
                if(!err){
                    res.send({status: 0, message: 'Brand inserted.'});
                    return true;
                } else {
                    res.send({status: 1, error: 'Brand not inserted.'});
                    return false;
                }
            });
        });
    };

    this.update = function(uuid, name, status, res){
        var self = this;

        //Check valid data
        if(uuid == "") {
            res.send({status: 1, error: "Invalid uuid."});
            return;
        }
        if(name == "") {
            res.send({status: 1, error: 'Invalid brand name.'});
            return;
        }
        if(!status) status = 1;

        this.brandDao.getByUuid(uuid, function(err, brand){
            if(brand == null) {
                res.send({status: 1, error: 'Brand not found.'});
                return false;
            }

            var brand = {};
            brand.uuid = uuid;
            brand.name = name;
            brand.status = status;

            self.brandDao.update(brand, function(err, rows){
                if(!err){
                    res.send({status: 0, message: 'Brand updated.'});
                    return true;
                } else {
                    res.send({status: 1, error: 'Brand not updated.'});
                    return false;
                }
            });
        });
    };

    this.deactive = function(uuid, res){
        var self = this;

        if(!uuid || uuid == '') {
            res.send({status: 1, error: 'Invalid brand uuid.'});
            return false;
        }

        this.brandDao.getByUuid(uuid, function(err, brand){
            if(brand == null) {
                res.send({status: 1, error: 'Brand not found.'});
                return false;
            }

            self.brandDao.deactive(uuid, function(err, rows){
                if(!err){
                    res.send({status: 0, message: 'Brand deactived.'});
                    return true;
                } else {
                    res.send({status: 1, error: 'Brand not deactived.'});
                    return false;
                }
            });
        });
    };

    this.active = function(uuid, res){
        var self = this;

        if(!uuid || uuid == '') {
            res.send({status: 1, error: 'Invalid brand uuid.'});
            return false;
        }

        this.brandDao.getByUuid(uuid, function(err, brand){
            if(brand == null) {
                res.send({status: 1, error: 'Brand not found.'});
                return false;
            }

            self.brandDao.active(uuid, function(err, rows){
                if(!err){
                    res.send({status: 0, message: 'Brand actived.'});
                    return true;
                } else {
                    res.send({status: 1, error: 'Brand not actived.'});
                    return false;
                }
            });
        });
    };

    this.list = function(res){
        this.brandDao.getAll(function(err, rows){
            if(!err){
                if(rows){
                    res.send({status: 0, brands: rows});
                    return true;
                } else {
                    res.send({status: 1, error: 'Brand not inserted.'});
                    return false;
                }
            } else {
                res.send({status: 1, error: 'Brand not inserted.'});
                return false;
            }
        });
    }

    this.getByName = function(name, res){
        this.brandDao.getByName(name, function(err, brands){
            if(!err){
                if(brands){
                    res.send({status: 0, brands: brands});
                    return true;
                } else {
                    res.send({status: 0, brands: []});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    }

    this.getByUuid = function(uuid, res){
        this.brandDao.getByUuid(uuid, function(err, brand){
            if(!err){
                if(brand){
                    res.send({status: 0, brand: brand});
                    return true;
                } else {
                    res.send({status: 0, brand: null});
                    return true;
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return false;
            }
        });
    }
}

module.exports = BrandModel;
