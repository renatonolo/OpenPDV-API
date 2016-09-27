var _uuid = require('node-uuid');
var MysqlDao = require('../dao/mysqlDao.js');
var SaleDao = require('../dao/saleDao.js');

function ReportModel(){
    this.dao = new MysqlDao();
    this.dao.init();
    this.saleDao = new SaleDao(this.dao);

    this.salesReport = function(start, end, page, res){
        this.saleDao.getByDateRange(start, end, page, function(err, sales){
            if(!err) {
                res.send({status: 0, sales: sales});
                return true;
            } else {
                res.send({status: 1, message: 'Internal error.'});
                return false;
            }
        });
    };
}

module.exports = ReportModel;
