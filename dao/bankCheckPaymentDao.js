function BankCheckPaymentDAO(db){
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

    this.insert = function(payment, callback){
        if(!payment) return false;

        var sql = "INSERT INTO bank_check_payments (uuid, sale, bankName, agency, account, value) VALUES ('" + payment.uuid + "', '" + payment.sale + "', '" + payment.bankName + "', '" + payment.agency + "', '" + payment.account + "', " + payment.value + ")";
        
        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, payment);
        });
    };
}

module.exports = BankCheckPaymentDAO;
