var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');
var OSS = require('ali-oss');
co = require('co');

__config = require('./config/config');
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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ extended: false }));
app.use(bodyParser.raw({ extended: false }));
app.use(xmlParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'ejs')));

var pc = require('./routes/pc');
var mobile = require('./routes/mobile');
var api = require('./routes/api');

app.use(function (req, res, next) {
	if (req.headers.proxy_uri == null) {
		__root = req.headers.host;
	}

	res.renderOrigin = res.render;
	res.render = function (view, opt) {
		res.renderOrigin(view, opt);
	}

	var weChatPatt = /MicroMessenger/i;
	var aliPayPatt = /alipay/i;

	var userAgent = req.headers["user-agent"];

	if (weChatPatt.test(userAgent)) {
		req.browser = 'weChat';
	} else if (aliPayPatt.test(userAgent)) {
		req.browser = 'aliPay';
	} else {
		req.browser = 'other';
	}

	if (req.headers['x-real-ip'] == null) {
		req.headers['x-real-ip']  = req.ip.split(':')[3];
	}

	next();
});

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
