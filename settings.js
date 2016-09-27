module.exports = {

    'server': {
        'ipaddress': process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
        'port': process.env.OPENSHIFT_NODEJS_PORT || 8000
    },

    'mysql': {
        'host': process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1",
        'port': process.env.OPENSHIFT_MYSQL_DB_PORT || "3306",

        'username': 'renato',
        'password': '123456',
        'database': 'openpdv'
    }
};
