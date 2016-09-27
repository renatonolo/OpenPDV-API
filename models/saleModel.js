var _uuid = require('node-uuid');
var MysqlDao = require('../dao/mysqlDao.js');
var SaleDAO = require('../dao/saleDao.js');
var UserDAO = require('../dao/userDao.js');
var MoneyPaymentDAO = require('../dao/moneyPaymentDao.js');
var DebitPaymentDAO = require('../dao/debitPaymentDao.js');
var BankCheckPaymentDAO = require('../dao/bankCheckPaymentDao.js');
var InstallmentPaymentDAO = require('../dao/installmentPaymentDao.js');

function SaleModel(){
    this.dao = new MysqlDao();
    this.dao.init();
    this.saleDao = new SaleDAO(this.dao);
    this.userDao = new UserDAO(this.dao);
    this.moneyPaymentDao = new MoneyPaymentDAO(this.dao);
    this.debitPaymentDao = new DebitPaymentDAO(this.dao);
    this.bankCheckPaymentDao = new BankCheckPaymentDAO(this.dao);
    this.installmentPaymentDao = new InstallmentPaymentDAO(this.dao);

    this.new = function(token, products, saleOff, res){
        var self = this;

        //Check valid data
        if(token == "") {
            res.send({status: 1, error: 'Invalid user.'});
            return false;
        }

        if(!saleOff || saleOff == "") saleOff = 0;
        if(products.length == 0) {
            res.send({status: 1, error: 'Insert a product.'});
            return;
        }

        var sale = {
            uuid: _uuid.v4(),
            user: '',
            saleOff: saleOff,
            date: new Date().getTime()
        };

        this.userDao.getByToken(token, function(err, user){
            if(!err){
                if(!user){
                    res.send({status: 1, error: 'User not found.'});
                    return;
                } else {
                    sale.user = user.uuid;
                    self.saleDao.insert(sale, function(err, rows){
                        if(!err){
                            self.saleDao.insertProductOnSale(sale.uuid, products, function(err){
                                if(!err){
                                    res.send({status: 0, message: 'Sale inserted.', uuid: sale.uuid});
                                    return;
                                } else {
                                    res.send({status: 1, error: 'Internal error.'});
                                    return;
                                }
                            });
                        } else {
                            res.send({status: 1, error: 'Internal error.'});
                            return;
                        }
                    });
                }
            } else {
                res.send({status: 1, error: 'Internal error.'});
                return;
            }
        });
    };

    this.addPayment = function(sale, type, payment, res){
        var self = this;

        if(!sale || sale == ""){
            res.send({status: 1, error: 'Insert a sale.'});
            return false;
        }
        if(!payment){
            res.send({status: 1, error: 'Insert a payment.'});
            return false;
        }

        this.saleDao.getByUuid(sale, function(err, rows){
            if(!err && rows){
                if(type == 0){
                    self.addMoneyPayment(sale, payment, res);
                } else if(type == 1){
                    self.addDebitPayment(sale, payment, res);
                } else if(type == 2){
                    self.addBankCheckPayment(sale, payment, res);
                } else if(type == 3){
                    self.addInstallmentPayment(sale, payment, res);
                }
            } else {
                res.send({status: 1, error: 'Sale not found.'});
                return false;
            }
        });
    };

    this.addMoneyPayment = function(sale, payment, res){
        var payment = {
            uuid: _uuid.v4(),
            sale: sale,
            value: payment.value
        };

        this.moneyPaymentDao.insert(payment, function(err, rows){
            if(!err){
                res.send({status: 0, message: 'Money payment inserted.'});
                return true;
            } else {
                res.send({status: 1, error: 'Failed to insert money payment.'});
                return false;
            }
        });
    };

    this.addDebitPayment = function(sale, payment, res){
        var payment = {
            uuid: _uuid.v4(),
            sale: sale,
            card: payment.card,
            value: payment.value
        };

        this.debitPaymentDao.insert(payment, function(err, rows){
            if(!err){
                res.send({status: 0, message: 'Debit payment inserted.'});
                return true;
            } else {
                res.send({status: 1, error: 'Failed to insert debit payment.'});
                return false;
            }
        });
    };

    this.addBankCheckPayment = function(sale, payment, res){
        var payment = {
            uuid: _uuid.v4(),
            sale: sale,
            bankName: payment.bankName,
            agency: payment.agency,
            account: payment.account,
            value: payment.value
        };

        this.bankCheckPaymentDao.insert(payment, function(err, rows){
            if(!err){
                res.send({status: 0, message: 'Bank check payment inserted.'});
                return true;
            } else {
                res.send({status: 1, error: 'Failed to insert bank check payment.'});
                return false;
            }
        });
    };

    this.addInstallmentPayment = function(sale, payment, res){
        var payments = [];

        for(var i = payment.length-1; i >= 0; i--){
            if(i == payment.length-1) var nextPayment = "";
            else nextPayment = payments[i+1].uuid;

            payments[i] = {
                uuid: _uuid.v4(),
                sale: sale,
                nextPayment: nextPayment,
                payment: payment[i].payment,
                value: payment[i].value
            };
        }

        this.installmentPaymentDao.insert(payments, function(err, rows){
            if(!err){
                res.send({status: 0, message: 'Installment payment inserted.'});
                return true;
            } else {
                res.send({status: 1, error: 'Failed to insert installment payment.'});
                return false;
            }
        });
    };

    this.getByUuid = function(uuid, res){
        if(!uuid || uuid == "") {
            res.send({status: 1, error: 'Uuid is empty.'});
            return false;
        } else {
            this.saleDao.getByUuid(uuid, function(err, sale){
                if(!err){
                    res.send({status: 0, sale: sale});
                    return true;
                } else {
                    res.send({status: 1, error: 'Internal server error.'});
                    return false;
                }
            });
        }
    };
}

module.exports = SaleModel;
