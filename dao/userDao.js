function UserDAO(db){
    this.db = db;

    this.getByUsername = function(username, callback){
        var self = this;

        var sql = "SELECT * FROM users WHERE username = '" + username + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0 || rows.length > 1) callback(null, null);
        });
    };

    this.getByUuid = function(uuid, callback){
        var self = this;

        var sql = "SELECT * FROM users WHERE uuid = '" + uuid + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0 || rows.length > 1) callback(null, null);
        });
    };

    this.getByToken = function(token, callback){
        var self = this;

        var sql = "SELECT * FROM users WHERE token = '" + token + "'";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length == 1) callback(null, rows[0]);
            else if(rows.length == 0 || rows.length > 1) callback(null, null);
        });
    };

    this.getAll = function(callback){
        var self = this;

        var sql = "SELECT uuid, name, username, last_login FROM users ORDER BY name";

        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else if(rows.length > 0) callback(null, rows);
            else if(rows.length == 0) callback(null, []);
        });
    }

    this.update = function(user, callback){
        if(!user.uuid) return false;

        var sql = "UPDATE users SET username = '"+user.username+"', password='"+user.password+"', name='"+user.name+"', last_login="+user.last_login+", token='"+user.token+"' WHERE uuid = '"+user.uuid+"'";
        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, user);
        });
    };

    this.insert = function(user, callback){
        if(!user.uuid) return false;

        var sql = "INSERT INTO users (uuid, username, password, name, token, last_login) VALUES ('" + user.uuid + "', '"+user.username+"', '"+user.password+"', '"+user.name+"', '"+user.token+"', "+user.last_login+")";
        this.db.query(sql, function(err, rows, fields){
            if(err) callback(err, null);
            else callback(null, user);
        });
    };
}

module.exports = UserDAO;
