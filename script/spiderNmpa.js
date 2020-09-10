const reqHttp = require("request_http");
const cheerio = require('cheerio');
const fs = require('fs');
const fns = require('../common/publicFunction');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const util = require('util');
const cache = require('node-file-cache').create({
	file: './objCache.json',
	life: 31536000
});

// http://app1.nmpa.gov.cn/data_nmpa/face3/search.jsp?6SQk6G2z=GBK-52sKb_kDsnCMAt5OLK1MSQHrLo2eXqs3_kYFeOF9thEdKFYpB5Px8nyzF6QnLZU.geQYMYRbmS_PJfv.zcAqd71K3XfGbz_Su_dhFQY31lntk2AJBB65EjBw7SaRuWx5jmFTrFTSdnwyU_3cr_KgsamzjK_s7Wqdu1sARzy0h4buvLZuf64R6.G8F92w6GIXrDyj.pJYxD59ZRK8IFWOdsVCK8xWOkH1Uv3juoJ29qTa3Qssqat76ies_J7rokV1Frn7IygJTgE.BqySdiwG3B7jASKh_0bnuqLdwTHRHLTBg3qfMMaHLX15of5Kvj5Pk8A6icbPpIWjHaTCQIZzMWawuAwKTJ3EVWQ8Xbkk_bGZ

var saveLog = function (msg) {
	if (typeof msg === 'object') {
		msg = util.inspect(msg);
	}
	var logData = `${fns.customFormatTime(new Date())}: ${msg}`;
	console.log(logData);
	var logFile = './logs/spiderNmpa.log';
	fs.appendFile(logFile, logData + '\n', {encoding: 'utf8', flag: 'a+'}, function (err) {
		if(err) {
			console.log(err);
		}
	});
};

var publicHttpHeader = {
	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
	Cookie: 'JSESSIONID=70ADB9881633D9B581B35DF80F7F4962.7; acw_tc=2f624a7515989382684323185e0eba81df26bcb87895666a6847698052c192; neCYtZEjo8GmS=5sovdTEoQrzE27QMTJRNSYxsbDIrAWSF6IiNptEF5BP4XaDlazc06HOiwD0bKCGaA6Wul8r1nseqU_OX9JuiPta; neCYtZEjo8GmT=5U06Q72eJ6i7qqqm01cRd8aWuppyjD_PdMUgGntMjFQWMciEuBYSqIVa.scFyPhZGuOX7mQuM3vW4H6065xekrmrMkRDXXksnWmIIv2umNu1puFz4LqlwuWbWMW6nTLm7RLd76qBhIDuugGBxWrvNrp9FbONCKPGtWGWYfWI685k2j3SwREI8c.EpyWCMF8q9ceSbOuWkar5A060hFX63YWshWwZy8AD6j5rhUZa6rRaK2YOPw_MCLF.mfEoqYW49c5oktLzxmtme4oEAUWDHw5sUZiB0K9DznBNtmNPaJTdHdpijRGx6LvXoOel_7Lrig',
	Referer: 'http://app1.nmpa.gov.cn/data_nmpa/face3/base.jsp?tableId=27&tableName=TABLE27&title=%BD%F8%BF%DA%D2%BD%C1%C6%C6%F7%D0%B5%B2%FA%C6%B7%A3%A8%D7%A2%B2%E1%A3%A9&bcId=152904442584853439006654836900',
	Origin: 'http://app1.nmpa.gov.cn',
	'Content-Type': 'application/x-www-form-urlencoded'
}

var getTotalList = function () {
	var option = {
		url: 'http://app1.nmpa.gov.cn/data_nmpa/face3/search.jsp?6SQk6G2z=GBK-52sKb_kDsnCMAt5OLK1MSQHrLo2eXqs3_kYFeOF9thEdKFYpB5Px8nyzF6QnLZU.geQYMYRbmS_PJfv.zcAqd71K3XfGbz_Su_dhFQY31lntk2AJBB65EjBw7SaRuWx5jmFTrFTSdnwyU_3cr_KgsamzjK_s7Wqdu1sARzy0h4buvLZuf64R6.G8F92w6GIXrDyj.pJYxD59ZRK8IFWOdsVCK8xWOkH1Uv3juoJ29qTa3Qssqat76ies_J7rokV1Frn7IygJTgE.BqySdiwG3B7jASKh_0bnuqLdwTHRHLTBg3qfMMaHLX15of5Kvj5Pk8A6icbPpIWjHaTCQIZzMWawuAwKTJ3EVWQ8Xbkk_bGZ',
		method: 'post',
		data: {
			tableId: "27",
			State: "1",
			bcId: "152904442584853439006654836900",
			State: "1",
			curstart: "2",
			State: "1",
			tableName: "TABLE27",
			State: "1",
			viewtitleName: "COLUMN200",
			State: "1",
			viewsubTitleName: "COLUMN192,COLUMN199",
			State: "1",
			keyword: "%E5%86%85%E7%AA%A5%E9%95%9C",
			State: "1",
			tableView: "%E8%BF%9B%E5%8F%A3%E5%8C%BB%E7%96%97%E5%99%A8%E6%A2%B0%E4%BA%A7%E5%93%81%EF%BC%88%E6%B3%A8%E5%86%8C%EF%BC%89",
			State: "1",
			cid: "0",
			State: "1",
			ytableId: "0",
			State: "1",
			searchType: "search",
			State: "1"
		},
		headers: publicHttpHeader
	};

	reqHttp(option, function (err, html) {
		if (err) {
			saveLog(err);
			return;
		}

		console.log(html);
	});
};

getTotalList();