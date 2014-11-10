var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');
global.uploadDir = "/img/up";
global.uploadPath = __dirname+'/public'+global.uploadDir;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
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
var restAPI = require('./src/restapi');

app.get('/', action.orderList);
app.post('/', action.orderList);
app.post('/doLogin', action.doLogin);
app.post('/doLogout', action.doLogout);

// local
app.get('/local', action.local);
app.post('/addLocal', action.addLocal);
app.post('/editLocal', action.editLocal);

// shop
app.post('/shop', action.shop);
app.post('/shopForm', action.shopForm);
app.post('/shopInfo', action.shopInfo);
app.post('/delShop', action.delShop);

app.get('/shopCate', action.shopCate);
app.post('/addCate', action.addCate);
app.post('/editCate', action.editCate);
app.post('/delCate', action.delCate);

app.post('/registShop', action.registShop);


// menu
app.post('/menu', action.menu);
app.post('/menuForm', action.menuForm);
app.post('/menuInfo', action.menuInfo);
app.post('/delMenu', action.delMenu);

app.post('/registMenu', action.registMenu);


// REST API
app.get('/api/localList', restAPI.localList);
app.post('/api/localList', restAPI.localList);
app.get('/api/shopCate', restAPI.shopCate);
app.post('/api/shopCate', restAPI.shopCate);




http.createServer(app).listen(app.get('port'), function () {
	console.log('');
	console.log('##############################################');
	console.log('#                                            #');
	console.log('#    Express server listening on port ' + app.get('port') + '   #');
	console.log('#                                            #');
	console.log('##############################################');
	console.log('');
});
