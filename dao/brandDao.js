function BrandDAO(db){
    this.db = db;

    this.getByUuid = function(uuid, callback){
        if(!uuid) return false;

        var sql = "SELECT * FROM brands WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0) callback(null, null);
        });
    };

    this.getByName = function(name, callback){
        if(name == '') callback(null, []);

        var sql = "SELECT * FROM brands WHERE name LIKE '%" + name + "%'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length >= 1) callback(null, rows);
            else if(rows.length == 0) callback(null, null);
        });
    };

    this.getAll = function(callback){
        var sql = "SELECT * FROM brands ORDER BY name";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, rows);
        });
    };

    this.insert = function(brand, callback){
        if(!brand || !brand.uuid || brand.uuid == '') return false;

        var sql = "INSERT INTO brands (uuid, name, status) VALUES ('" + brand.uuid + "', '" + brand.name + "', " + brand.status + ")";
        
        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, brand);
        });
    };

    this.update = function(brand, callback){
        if(!brand || !brand.uuid || brand.uuid == '' || !brand.name || brand.name == '') return false;

        var sql = "UPDATE brands SET name = '" + brand.name + "', status = " + brand.status + " WHERE uuid = '" + brand.uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, brand);
        });
    };

    this.deactive = function(uuid, callback){
        if(!uuid || uuid == '') return false;

        var sql = "UPDATE brands SET status = 0 WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, uuid);
        });
    };

    this.active = function(uuid, callback){
        if(!uuid || uuid == '') return false;

        var sql = "UPDATE brands SET status = 1 WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, uuid);
        });
    };
}

module.exports = BrandDAO;
