var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.cookieSession({ path: '/', httpOnly: false, secret: 'secret', cookie: { maxAge: null }}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var action = require('./src/action');

app.get('/', action.orderList);
app.post('/', action.orderList);
app.post('/doLogin', action.doLogin);
app.get('/doLogout', action.doLogout);

// local
app.get('/local', action.local);
app.post('/addLocal', action.addLocal);
app.post('/editLocal', action.editLocal);

//shop
app.get('/shop', action.shop);
app.post('/shop', action.shop);



http.createServer(app).listen(app.get('port'), function () {
	console.log('');
	console.log('##############################################');
	console.log('#                                            #');
	console.log('#    Express server listening on port ' + app.get('port') + '   #');
	console.log('#                                            #');
	console.log('##############################################');
	console.log('');
});
