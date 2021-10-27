var urlParse   = require('url');
var htmlparser = require('htmlparser2');
var util       = require('util');

var insertOrUpdateUserResource = (req, res) => {
	var insertOrUpdateUserResourceJson = {
		tableName: 'service.user_resource',
		data: {
			uid: req.allParams.userInfo.id,
			filename: req.allParams.result.name,
			artist: req.allParams.result.artist,
			mimetype: req.allParams.result.mimetype,
			url: req.allParams.result.resourceUrl,
			md5: 'OTHER STORAGE',
			description: req.allParams.result.description
		},
		uniqueFieldName: ['uid', 'url']
	};

	insertOrUpdate(insertOrUpdateUserResourceJson, (err, result) => {
		if (err) {
			return;
		}
		req.allParams.result.resourceId = result.insertId;
		res.success(req.allParams.result);
	});
};

var parseChangbaResource = (req, res) => {
	var options = {
		url: req.allParams.urlParse.href
	};
	reqHttp(options, (err, data) => {
		if (err) {
			res.error('资源获取错误 ' + err);
			return;
		}

		try {
			var parser = new htmlparser.Parser({
				onopentag: (tagname, attribs) => {
					if(tagname === "meta" && attribs.name === 'description'){
						var desSplit = attribs.content.split(',');
						req.allParams.result.name = desSplit[0];
						req.allParams.result.artist = desSplit[1];
					}
					if(tagname === "body"){
						req.allParams.result.resourceUrl = 'https://qiniuuwmp3.changba.com/' + attribs['data-workid'] + '.mp3';
					}
				},
				ontext: (text) => {
				},
				onclosetag: (tagname) => {

				}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();

			if (req.allParams.result.name && req.allParams.result.artist && req.allParams.result.resourceUrl) {
				req.allParams.result.mimetype = 'audio/mpeg';
				insertOrUpdateUserResource(req, res);
				return;
			}

			throw "Non Resource"
		} catch (e) {
			console.log(e);
			res.error('资源解析错误，请检查链接有效性');
		}
	});
};

var parseQuanMinKGeResource = (req, res) => {
	var options = {
		url: req.allParams.urlParse.href,
		headers: {
			'user-agent': 'Mozilla/5.0 (Linux; U; X11; en-US; Valve Steam Tenfoot/1533766730; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
		}
	};
	reqHttp(options, (err, data) => {
		if (err) {
			console.log(options);
			res.error('资源获取错误 ' + err);
			return;
		}

		try {
			var catchHtml = '';
			var start = false;
			var success = false;

			var parser = new htmlparser.Parser({
				onopentag: (tagname, attribs) => {
					if (tagname === 'script' && !start && !success) {
						start = true;
					}
				},
				ontext: (text) => {
					if (start && !success) {
						catchHtml += text;
					}
				},
				onclosetag: (tagname) => {
					if (tagname === 'script' && start && !success) {
						start = false;
						catchHtml = catchHtml.trim();
						var patt = /window\.__DATA__\s=\s/;

						if (patt.test(catchHtml)) {
							catchHtml = catchHtml.replace(patt, '');
							catchHtml = catchHtml.replace(/;$/, '');
							catchJson = JSON.parse(catchHtml);

							req.allParams.result.name = `${catchJson.detail.song_name} - ${catchJson.detail.singer_name}`;
							req.allParams.result.artist = catchJson.detail.nick;
							req.allParams.result.resourceUrl = catchJson.detail.playurl;
							success = true;
						} else {
							catchHtml = '';
						}
					}
				}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();
			// var resourceUrlParse = urlParse.parse(req.allParams.result.resourceUrl);
			// req.allParams.result.resourceUrl = `${resourceUrlParse.protocol}//${resourceUrlParse.host}${resourceUrlParse.pathname}`;

			if (req.allParams.result.name && req.allParams.result.artist && req.allParams.result.resourceUrl) {
				req.allParams.result.mimetype = 'audio/mp4';
				insertOrUpdateUserResource(req, res);
				return;
			}

			throw "Non Resource"
		} catch (e) {
			console.log(e);
			res.error('资源解析错误，请检查链接有效性');
		}
	});
};

var parseDouYinResource = (req, res) => {
	var options = {
		url: req.allParams.urlParse.href,
		headers: {
			'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
			'Cookie': 'douyin.com; __ac_nonce=06178c21b00b97f65ea0b; __ac_signature=_02B4Z6wo00f01rQ.GSAAAIDD3XH-USUxcX60Hx2AAMyD53; ttcid=148f76a177014b459ad5d62fa670de3922; ttwid=1%7CYk3-rMHhe56rmo0xG2QvScRZ5z9L8RJQ9fE5mm1X4qM%7C1635303963%7C36c129f9cf73acb5f72dabebfc5fbb7cedf88b3cc7326e30f72b2effc3b1b8a5; _tea_utm_cache_6383=undefined; MONITOR_WEB_ID=9955a71e-3c7f-4942-bca6-92f19baaa1e6; passport_csrf_token_default=a34da08a109ff691fbf46e3572ed797f; passport_csrf_token=a34da08a109ff691fbf46e3572ed797f; _tea_utm_cache_1300=undefined; s_v_web_id=verify_kv8xrb4c_2q5L6c0o_gTzW_4FTV_ARcm_AsXYMb3lvYtL; tt_scid=zWJjVJCAadg05fB1MqIwM2loCH8T7x7ohbNJEdRssJd2Z4gL3C--sWZnes9BNvQad86b; msToken=incOcNSZ6n7lS-VUW4eX3BtqYvKmSI7hXNnzB6giUjAB5Uhzg6VkpPR5s0UpzsCFcszlA-CEZKvsP-eyxOgHo_3ch4gFJ3if1gUApWTa5O3TqBDxE_UP9uk='
		}
	};
	reqHttp(options, (err, data) => {
		if (req.allParams.retryCount == null) {
			req.allParams.retryCount = 0;
		}
		if (req.allParams.retryCount > 5) {
			res.error('资源解析尝试5次错误，请检查链接有效性');
			return;
		}
		try {
			// console.log(typeof(data));
			// console.log('/////////////////////');
			// console.log(data);
			// console.log('/////////////////////');

			if (typeof(data) == 'object') {
				req.allParams.urlParse.href = data.href;
				req.allParams.retryCount++;
				parseDouYinResource(req, res);
				return;
			}
			if (data.length <= 1024) {
				var reg = />.*</;
				req.allParams.urlParse.href = reg.exec(data)[0].replace('>', '').replace('<', '')
				req.allParams.retryCount++;
				parseDouYinResource(req, res);
				return;
			}

			var start = false;
			var success = false;

			var parser = new htmlparser.Parser({
				onopentag: (tagname, attribs) => {
					if(tagname === "script" && attribs.id === 'RENDER_DATA' && !success){
						start = true;
					}
				},
				ontext: (text) => {
					if (start && !success) {
						success                          = true;
						var mediaInfo                    = JSON.parse(decodeURIComponent(text));
						mediaInfo                        = mediaInfo.C_20.aweme.detail;
						req.allParams.result.name        = mediaInfo.desc;
						req.allParams.result.artist      = mediaInfo.authorInfo.nickname;
						req.allParams.result.resourceUrl = mediaInfo.download.url;
					}
				},
				onclosetag: (tagname) => {
					// console.log(catchHtml);
				}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();

			if (req.allParams.result.name && req.allParams.result.artist && req.allParams.result.resourceUrl) {
				req.allParams.result.mimetype = 'video/mp4';
				insertOrUpdateUserResource(req, res);
				return;
			}

			throw "Non Resource"
		} catch (e) {
			console.log(e);
			res.error('资源解析错误，请检查链接有效性');
		}
	});
};

var switchResource = (req, res) => {
	console.log(req.allParams);
	req.allParams.result.description = req.allParams.urlParse.host;
	switch (req.allParams.urlParse.host) {
		case 'changba.com':

		parseChangbaResource(req, res);
		break;

		case 'kg.qq.com':
		case 'kg1.qq.com':
		case 'kg2.qq.com':
		case 'kg3.qq.com':
		case 'kg4.qq.com':
		case 'kg5.qq.com':
		case 'kg6.qq.com':
		case 'kg7.qq.com':
		case 'kg8.qq.com':
		case 'kg9.qq.com':
		case 'node.kg.qq.com':

		parseQuanMinKGeResource(req, res);
		break;

		case 'www.douyin.com':
		case 'v.douyin.com':
		case 'douyin.com':

		parseDouYinResource(req, res);
		break;

		default:

		res.error('未知资源类型');
	}
};

module.exports = (req, res, next) => {
	req.verifyParams({
		"url": "*",
	}, (rejected) => {
		req.allParams.url = req.allParams.url.trim();
		req.allParams.urlParse = urlParse.parse(req.allParams.url);

		req.allParams.result = {};

		if (req.allParams.urlParse.protocol == null) {
			res.error('URL IS ILLEGAL');
			return;
		}

		switchResource(req, res);
	});
};
