function InstallmentPaymentDAO(db){
    this.db = db;

    this.getByUuid = function(uuid, callback){
        if(!uuid) return false;

        var sql = "SELECT * FROM bank_check_payments WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0) callback(null, null);
        });
    };

    this.insert = function(payments, callback){
        if(!payments || payments.length == 0) return false;

        var sql = "INSERT INTO installment_payments (uuid, sale, nextPayment, payment, value) VALUES ?";

        var values = [];
        for(var i = 0; i < payments.length; i++){
            value = [payments[i].uuid, payments[i].sale, payments[i].nextPayment, payments[i].payment, payments[i].value];
            values.push(value);
        }

        this.db.multipleQuery(sql, values, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, payments);
        });
    };
}

module.exports = InstallmentPaymentDAO;
