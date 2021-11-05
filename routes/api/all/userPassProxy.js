var https = require('https');
var http = require('http');
var url = require('url');

module.exports = (req, res, next) => {
	req.verifyParams({
		"url": "*"
	}, (rejected) => {
		if (rejected) {
			return;
		}
		req.allParams.url = decodeURIComponent(req.allParams.url);
		req.allParams.urlParse = url.parse(req.allParams.url);
		console.log(req.method);

		var reqFn;
		var reqOption = {
			hostname: req.allParams.urlParse.hostname,
			path: req.allParams.urlParse.path,
			method: req.allParams.method || 'GET',
			timeout: 60000
		};

		if (req.allParams.urlParse.protocol == 'http:') {
			reqFn = http;
			reqOption.port = 80;
		}
		if (req.allParams.urlParse.protocol == 'https:') {
			reqFn = https;
			reqOption.port = 443;
		}
		if (req.allParams.headers) {
			reqOption.headers = req.allParams.headers;
		}

		reqCli = reqFn.request(reqOption, function (proxyRes) {
			res.set(proxyRes.headers);
			proxyRes.on('data', function (chunk) {
				res.write(chunk);
			});
			proxyRes.on('end', function () {
				res.end();
			});
		});

		if (req.allParams.data) {
			req.write(req.allParams.data);
		}

		reqCli.end();
	});
};