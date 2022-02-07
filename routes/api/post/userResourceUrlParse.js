var urlParse    = require('url');
var htmlparser  = require('htmlparser2');
var util        = require('util');
const CryptoJS  = require('crypto-js');
var querystring = require('qs');
var tough       = require('tough-cookie');

var Cookie    = tough.Cookie;
var cookiejar = new tough.CookieJar();

var chrome = require('nodejs-chrome');

var insertOrUpdateUserResource = (req, res) => {
	var insertOrUpdateUserResourceJson = {
		tableName: 'service.user_resource',
		data: {
			uid: req.allParams.userInfo.id,
			filename: common.removeEmoji(req.allParams.result.name),
			artist: common.removeEmoji(req.allParams.result.artist),
			mimetype: req.allParams.result.mimetype,
			url: req.allParams.result.resourceUrl,
			md5: 'OTHER STORAGE',
			description: req.allParams.result.description
		},
		uniqueFieldName: ['uid', 'url']
	};

	insertOrUpdate(insertOrUpdateUserResourceJson, (err, result) => {
		if (err) {
			res.error('资源登记错误');
			return;
		}
		req.allParams.result.resourceId = result.insertId;
		res.success(req.allParams.result);
	});
};


var parseChangbaUrlFn = (urlEncoded) => {
	var d = String.fromCharCode.apply(String, [97, 49, 55, 102, 101, 55, 52, 101, 52, 50, 49, 99, 50, 99, 98, 102, 51, 100, 99, 51, 50, 51, 102, 52, 98, 52, 102, 51, 97, 49, 97, 102]);
	var c = CryptoJS.enc.Utf8.parse(d.substring(0, 16));
	var l = CryptoJS.enc.Utf8.parse(d.substring(16));
	return CryptoJS.AES.decrypt(urlEncoded, l, {
		iv: c,
		padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8);
};
var parseChangbaResource = (req, res) => {
	var options = {
		url: req.allParams.urlParse.href,
		headers: {
			'user-agent': 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
		}
	};
	reqHttp(options, (err, data) => {
		if (err) {
			res.error('资源获取错误 ' + err);
			console.log(data);
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
				},
				ontext: (text) => {
					var pat = /commonObj\.url.*;/
					if (pat.test(text)) {
						var urlEncoded                   = pat.exec(text)[0];
						urlEncoded                       = urlEncoded.replace("commonObj.url = '", '');
						urlEncoded                       = urlEncoded.replace("';", '');
						var resourceUrl                  = parseChangbaUrlFn(urlEncoded);
						req.allParams.result.resourceUrl = resourceUrl;
					}
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
	reqHttp(options, (err, data, resHeaders, resCode) => {
		if (err) {
			console.log(options);
			res.error('资源获取错误 ' + err);
			return;
		}

		// console.log('//////////////////////////////////////////////');
		// console.log(resCode);
		// console.log(err);
		// console.log(data);
		// console.log(resHeaders);

		if (resCode == 302) {
			req.allParams.urlParse.href = resHeaders.location;
			parseQuanMinKGeResource(req, res);
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

var parseDouYinResourceBak = async (req, res, retryCount) => {

	var browser = await chrome({
		device: {
			userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
		}
	});
	try {
		var page = await browser.tabnew();
		await page.setUrl(req.allParams.urlParse.href);
		var data = await page.text();
		browser.exit();
	} catch (e) {
		console.log(e);
		browser.exit();
		res.error('网页打开错误');
		return;
	}

	try {

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
					console.log(util.inspect(mediaInfo));
					mediaInfo                        = mediaInfo['21'].aweme.detail;
					req.allParams.result.name        = mediaInfo.desc;
					req.allParams.result.artist      = mediaInfo.authorInfo.nickname;
					req.allParams.result.resourceUrl = 'https:' + mediaInfo.video.playAddr[0].src;
					req.allParams.result.resourceUrl = `${req.protocol}://${req.host}/api/userPassProxy?url=${encodeURIComponent(req.allParams.result.resourceUrl)}`;
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

		console.log(req.allParams.result);

		throw "Non Resource"
	} catch (e) {
		console.log(e);
		res.error('资源解析错误，请检查链接有效性');
	}
};

var parseDouYinResource = (req, res) => {
	var options = {
		url: req.allParams.urlParse.href,
		redirectChain: true,
		headers: {
			'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
		}
	};

	reqHttp(options, (err, data, resHeaders, resCode) => {
		if (err) {
			res.error(err);
			return;
		}

		var pathnameParseArr = resHeaders.lastReqOptions.urlParse.pathname.split('/').filter((cell) => {return cell != ''});
		var videoId = pathnameParseArr[pathnameParseArr.length - 1]
		var reqApiOptions = {
			url: `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${videoId}`,
			headers: {
				'authority': 'www.iesdouyin.com',
				'cache-control': 'max-age=0',
				'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Linux"',
				'upgrade-insecure-requests': '1',
				'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'sec-fetch-site': 'none',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-user': '?1',
				'sec-fetch-dest': 'document',
				'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,hu;q=0.7,und;q=0.6,es;q=0.5'
			}
		};
		reqHttp(reqApiOptions, (err, data, resHeaders, resCode) => {
			if (err) {
				res.error(err);
				return;
			}
			if (data.status_code != 0) {
				res.error(data);
				return;
			}
			var videoInfo = data.item_list[0];
			req.allParams.result.name        = videoInfo.desc;
			req.allParams.result.artist      = videoInfo.author.nickname;
			req.allParams.result.mimetype    = 'video/mp4';
			req.allParams.result.resourceUrl = videoInfo.video.play_addr.url_list[0];

			var parseVideoUrlOption = {
				url: req.allParams.result.resourceUrl,
				headers: {
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
				},
				redirectChain: true,
				headersOnly: true
			};
			reqHttp(parseVideoUrlOption, (err, data, resHeaders, resCode) => {
				if (err) {
					res.error(err);
					return;
				}
				req.allParams.result.resourceUrl      = resHeaders.lastReqOptions.urlParse.href;
				req.allParams.result.resourceUrlProxy = `${req.protocol}://${req.host}/api/userPassProxy?url=${encodeURIComponent(req.allParams.result.resourceUrl)}`;

				insertOrUpdateUserResource(req, res);
			});
		});
	});
};

var parseXimalayaResourceBak = (req, res, cookie, retryCount) => {
	var checkDone = () => {
		if (req.allParams.result.name && req.allParams.result.artist && req.allParams.result.resourceUrl) {
			req.allParams.result.mimetype = 'audio/mp4';
			insertOrUpdateUserResource(req, res);
			return;
		}
	};

	var pathSplit = req.allParams.urlParse.pathname.split('/');
	var audioId   = pathSplit[pathSplit.length - 1];
	var albumId   = '';
	if (querystring.parse(req.allParams.urlParse.query).albumIds) {
		albumId = querystring.parse(req.allParams.urlParse.query).albumIds.split(',')[0]
	} else {
		albumId = pathSplit[pathSplit.length - 2];
	}

	reqHttp({
		url: `https://www.ximalaya.com/tdk-web/seo/getTdk?typeName=TRACK&uri=${encodeURIComponent(`/yule/${albumId}/${audioId}`)}`,
		headers: {
			Cookie: '_xmLog=h5&d3f59f81-a75e-4171-ab85-29e62d45294c&2.4.9; trackType=web; xm-page-viewid=ximalaya-web; Hm_lvt_4a7d8ec50cfd6af753c4f8aee3425070=1635742099; 1&remember_me=y; 1&_token=76235755&8DBDB0C0240NF06321496E41A3847AFBDCE6D63475BC8C84DFA6A1FF0D92FD8748C2A3851627111MCF2C5B6B46D7E0A_; 1_l_flag=76235755&8DBDB0C0240NF06321496E41A3847AFBDCE6D63475BC8C84DFA6A1FF0D92FD8748C2A3851627111MCF2C5B6B46D7E0A__2021-11-0115:16:05; x_xmly_traffic=utm_source%253A%2526utm_medium%253A%2526utm_campaign%253A%2526utm_content%253A%2526utm_term%253A%2526utm_from%253A; Hm_lpvt_4a7d8ec50cfd6af753c4f8aee3425070=1635751007'
		}
	}, (err, data, resHeaders, resCode) => {
		if (err) {
			res.error('资源获取错误 ' + err);
			return;
		}
		req.allParams.result.name = data.data.tdkMeta.title;
		req.allParams.result.artist = data.data.tdkMeta.title;
		checkDone();
	});
	reqHttp({
		url: `https://www.ximalaya.com/revision/play/v1/audio?id=${audioId}&ptype=1`,
		headers: {
			Cookie: '_xmLog=h5&d3f59f81-a75e-4171-ab85-29e62d45294c&2.4.9; trackType=web; xm-page-viewid=ximalaya-web; Hm_lvt_4a7d8ec50cfd6af753c4f8aee3425070=1635742099; 1&remember_me=y; 1&_token=76235755&8DBDB0C0240NF06321496E41A3847AFBDCE6D63475BC8C84DFA6A1FF0D92FD8748C2A3851627111MCF2C5B6B46D7E0A_; 1_l_flag=76235755&8DBDB0C0240NF06321496E41A3847AFBDCE6D63475BC8C84DFA6A1FF0D92FD8748C2A3851627111MCF2C5B6B46D7E0A__2021-11-0115:16:05; x_xmly_traffic=utm_source%253A%2526utm_medium%253A%2526utm_campaign%253A%2526utm_content%253A%2526utm_term%253A%2526utm_from%253A; Hm_lpvt_4a7d8ec50cfd6af753c4f8aee3425070=1635751007'
		}
	}, (err, data, resHeaders, resCode) => {
		if (err) {
			res.error('资源获取错误 ' + err);
			return;
		}
		req.allParams.result.resourceUrl = data.data.src;
		checkDone();
	});
};

var parseXimalayaResource = (req, res, retryCount) => {
	var retryCount = retryCount || 0;
	if (retryCount > 10) {
		res.error('重试次数过多');
		return;
	}

	var checkDone = () => {
		if (req.allParams.result.name && req.allParams.result.artist && req.allParams.result.resourceUrl) {
			req.allParams.result.mimetype = 'audio/mp4';
			insertOrUpdateUserResource(req, res);
			return;
		}
	};

	var options = {
		url: req.allParams.urlParse.href,
		headers: {
			'user-agent': 'Mozilla/5.0 (Linux; U; X11; en-US; Valve Steam Tenfoot/1533766730; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
		}
	};

	var currentCookie = cookiejar.getCookiesSync(`http://${req.allParams.urlParse.host}`);
	if (currentCookie.length != 0) {
		options.headers.Cookie = '';
		currentCookie.forEach(cookie => {
			var cookieJson = cookie.toJSON();
			options.headers.Cookie += `${cookieJson.key}=${cookieJson.value}; `
		});
	}

	reqHttp(options, (err, data, resHeaders, resCode) => {
		console.log(`//////// REQUEST RECIVE /////////////////////////////////////`);
		// console.log(`err       : ${err}`);
		// console.log(`data      : ${data}`);
		console.log(`resHeaders: ${util.inspect(resHeaders)}`);
		console.log(`urlParse  : ${util.inspect(req.allParams.urlParse)}`);
		// console.log(`resCode   : ${resCode}`);

		if (err) {
			res.error('资源获取错误 ' + err);
			return;
		}

		if (resHeaders['set-cookie']) {
			if (resHeaders['set-cookie'] instanceof Array)
				cookies = resHeaders['set-cookie'].map(Cookie.parse);
			else
				cookies = [Cookie.parse(resHeaders['set-cookie'])];
			cookies.forEach(cookie => {
				var cookieJson = cookie.toJSON();
				cookiejar.setCookieSync(cookie, `http://${cookieJson.domain}`);
			});
		}

		if (resCode == 302 || resCode == 301 || resCode == 303) {
			if (resHeaders.location[0] == '/') {
				resHeaders.location = `${req.allParams.urlParse.protocol}//${req.allParams.urlParse.host}${resHeaders.location}`
			}

			req.allParams.url      = resHeaders.location;
			req.allParams.urlParse = urlParse.parse(resHeaders.location);

			retryCount++;
			parseXimalayaResource(req, res, retryCount);
			return;
		}

		try {

			var start   = false;
			var success = false;
			var parser  = new htmlparser.Parser({
				onopentag: (tagname, attribs) => {
					if (tagname == 'script' && !success) {
						start = true;
					}
				},
				ontext: (text) => {
					if (!start || success) {
						return;
					}

					var compare = /^window.__INITIAL_STATE__/.test(text);

					if (!compare) {
						return;
					}
					text = text.replace("window.__INITIAL_STATE__ = ", "");
					text = text.replace("};", "}");
					var analyseObj = JSON.parse(text);
					var albumInfo = analyseObj[req.allParams.urlParse.path].albumInfo;
					var trackInfo = analyseObj[req.allParams.urlParse.path].trackInfo;
					req.allParams.result.name = `${albumInfo.title}-${trackInfo.title}`;
					req.allParams.result.artist = '喜马拉雅';
					req.allParams.result.resourceUrl = trackInfo.src;

					console.log(util.inspect(analyseObj, {depth: 6}));

					success = true;
				},
				onclosetag: (tagname) => {

				}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();

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
	req.allParams.result.description = req.allParams.urlParse.href;
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

		case 'www.ximalaya.com':
		case 'ximalaya.com':
		case 'm.ximalaya.com':
		case 'xima.tv':

		parseXimalayaResource(req, res);
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
