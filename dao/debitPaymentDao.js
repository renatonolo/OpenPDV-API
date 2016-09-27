function DebitPaymentDAO(db){
    this.db = db;

    this.getByUuid = function(uuid, callback){
        if(!uuid) return false;

        var sql = "SELECT * FROM debit_payments WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0) callback(null, null);
        });
    };

    this.insert = function(payment, callback){
        if(!payment) return false;

        var sql = "INSERT INTO debit_payments (uuid, sale, value, card) VALUES ('" + payment.uuid + "', '" + payment.sale + "', " + payment.value + ", '" + payment.card + "')";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, payment);
        });
    };
}

module.exports = DebitPaymentDAO;
