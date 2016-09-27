var ReportModel = require('../../models/reportModel.js');
var reportModel = new ReportModel();

module.exports = {
    '/reports/sales/:start/:end/:page': {
        get: function(req, res, cb){
            reportModel.salesReport(req.params.start, req.params.end, req.params.page, res);
        }
    }
};
