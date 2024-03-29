crypto = require('crypto');
fs = require('fs');
co = require('co');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var sassMiddleware = require('node-sass-middleware');
var OSS = require('ali-oss');

__config = require('./config/config');
weChatLib = require('./lib/weChatLib');
redis = require('redis-pool-fns')(__config.redis);
require("mysql-pool-crud")(__config.mysql);
common = require('./common/publicFunction');
reqHttp = require("request_http");
ossClient = new OSS(__config.aliYunOss);

var app = express();

require('./common/router').runAllPrograms('./programs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {

	if (__config.allowCrossOriginArr.indexOf(req.headers.origin) >= 0) {
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
	}
	if (req.headers['x-real-ip'] == null) {
		req.headers['x-real-ip']  = req.ip.split(':')[3];
	}
	next();
});
app.use(logger('dev'));
app.use(fileUpload());
app.use(session({
	secret: 'keyboard cat',
	cookie: {
		maxAge: 60000
	},
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ extended: false }));
app.use(bodyParser.raw({ extended: false }));
app.use(xmlParser());
app.use(cookieParser());
app.use(sassMiddleware({
	src: __dirname + '/sass',
	response: false,
	dest: __dirname + '/public',
	debug: false,
	outputStyle: 'extended'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'ejs')));

var pc = require('./routes/pc');
var mobile = require('./routes/mobile');
var api = require('./routes/api');

app.use('/pc', pc);
app.use('/mobile', mobile);

var pcormobile = express.Router();

pcormobile.get('/', function(req, res, next) {
	if (/Mobile/ig.test(req.headers['user-agent'])) {
		res.redirect('/mobile/');
	} else {
		res.redirect('/pc/');
	}
});

app.use('/', pcormobile);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
