var urlParse = require('url');
var htmlparser = require("htmlparser2");

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
			'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
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
			var resourceUrlParse = urlParse.parse(req.allParams.result.resourceUrl);
			req.allParams.result.resourceUrl = `${resourceUrlParse.protocol}//${resourceUrlParse.host}${resourceUrlParse.pathname}`;

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

var switchResource = (req, res) => {
	console.log(req.allParams);
	req.allParams.result.description = req.allParams.urlParse.host;
	switch (req.allParams.urlParse.host) {
		case 'changba.com':

		parseChangbaResource(req, res);

		break;
		case 'kg2.qq.com':
		case 'node.kg.qq.com':

		parseQuanMinKGeResource(req, res);

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
