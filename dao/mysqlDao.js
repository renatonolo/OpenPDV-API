var mysql = require('mysql');
var settings = require('../settings.js');

function Mysql(){
    this.mysql = mysql;
    this.settings = settings.mysql;

    this.connection = null;

    this.init = function(){
        this.connection = this.mysql.createConnection({
            host: this.settings.host,
            port: this.settings.port,
            user: this.settings.username,
            password: this.settings.password,
            database: this.settings.database,
            multipleStatements: true
        });

        this.connection.connect();
        console.log("Mysql connected...");
    };

    this.query = function(sql, callback){
        this.connection.query(sql, callback);
    };

    this.multipleQuery = function(sql, values, callback){
        this.connection.query(sql, [values], callback);
    };
}

module.exports = Mysql;
