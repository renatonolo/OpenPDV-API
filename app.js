var restify = require('restify');
var restifyRoutes = require('restify-routes');
var settings = require(__dirname + '/settings.js');
var UserModel = require(__dirname + '/models/userModel.js');
var userModel = new UserModel();
var self = this;

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false })); // mapped in req.body
server.use(restify.queryParser());
server.use(restify.CORS());
server.use(function checkUser(req, res, next){
    if(req.url != "/user/login") {
        var token = req.headers.authorization;
        userModel.checkToken(token, res, next);
    } else return next();
});
restifyRoutes.set(server, __dirname + '/routes');

server.listen(settings.server.port, function () {
    console.log('Server running on %s', server.url);
});
