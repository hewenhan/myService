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

// POST DATA
// SpecParmBands[spType]: 2
// SpecParmBands[molId]: 9
// SpecParmBands[state]: new
// SpecParmBands[dsId]: hitran
// SpecParmBands[spFun]: 4
// SpecParmBands[isots]: 1
// SpecParmBands[WNlow]: 0
// SpecParmBands[WNup]: 4093
// SpecParmBands[bands]: 1-1,2-1,2-2,3-2,4-1,5-1,6-3,7-2,8-2,13-1,14-1,15-1,18-2,27-1
// SpecParmBands[bandFilter]: {"_search":false,"nd":1583576073498,"rows":10,"page":2,"sidx":"","sord":"asc"}
// vsUp: 
// vsLow: 
// lines: 
// WNmin: 
// WNmax: 
// Smin: 
// Smax: 
// Sv: 
// jqg_band-list_14-1: on
// jqg_band-list_15-1: on
// jqg_band-list_18-2: on
// jqg_band-list_27-1: on
// SpecParmBands[Icut]: 1.0E-28
// SpecParmBands[Tmin]: 1
// SpecParmBands[Tmax]: 3500
// SpecParmBands[T]: 296
// SpecParmBands[P]: 1
// SpecParmBands[C]: 0.0001
// SpecParmBands[shape]: 0
// SpecParmBands[wing]: 50
// SpecParmBands[WNst]: 0.04006
// SpecParmBands[af]: 0
// SpecParmBands[ar]: 0.1
// SpecParmBands[aw]: 50
// SpecParmBands[lPath]: 1
// SpecParmBands[saveTo]: cache
// SpecParmBands[batchMode]: 0
// yt2: Start simulation

var saveLog = function (msg) {
	if (typeof msg === 'object') {
		msg = util.inspect(msg);
	}
	var logData = `${fns.customFormatTime(new Date())}: ${msg}`;
	console.log(logData);
	var logFile = './logs/spiderHitran.log';
	fs.appendFile(logFile, logData + '\n', {encoding: 'utf8', flag: 'a+'}, function (err) {
		if(err) {
			console.log(err);
		}
	});
};

var saveCsv = function (fileName, content) {
	var logFile = `./logs/hitran_${fileName}.txt`;
	fs.writeFileSync(logFile, content + '\n', {encoding: 'utf8', flag: 'a+'});
};

const downloadResultCsv = (gasObj, cb) => {
	var options = {
		url: `http://hitran.iao.ru/bands/download?id=${gasObj.downloadFileName}`,
		data: {},
		headers: {
			'Cookie': publicHttpHeader.Cookie
		},
		timeout: 7200000
	};

	reqHttp(options, (err, csv) => {
		if (err) {
			cb(err);
			return;
		}

		var fileName = `${gasObj.gasName}_${gasObj.wnMax}_${gasObj.firstIds}`;

		saveCsv(fileName, csv);
		saveLog(`downloadResultCsv ${fileName} DONE`);
		cb();
	});
};

const getFileNamePath = (gasObj, cb) => {
	var options = {
		method: 'post',
		url: `http://hitran.iao.ru/ajax/spectrCache?sessId=${publicHttpHeader.Cookie.split('=')[1]}&mmId=${gasObj.gasType}&spFun=${gasObj.reqData['SpecParmBands[spFun]']}&spType=${gasObj.reqData['SpecParmBands[spType]']}`,
		data: {},
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': publicHttpHeader.Cookie
		},
		timeout: 7200000
	};

	reqHttp(options, (err, json) => {
		if (err) {
			cb(err);
			return;
		}
		
		if (json.data.length == 0) {
			cb('getIosList length 0');
			return;
		}
		saveLog(`getFileNamePath DONE`);

		var idRegExp = new RegExp(` ${gasObj.firstIds}`);

		for (var i = 0; i < json.data.length; i++) {
			if (idRegExp.test(json.data[i].qParm)) {
				gasObj.downloadFileName = json.data[i].file;
				break;
			}
		}


		downloadResultCsv(gasObj, cb);
	});
};

const simulateSpectrum = (gasObj, cb) => {
	var options = {
		method: 'post',
		url: `http://hitran.iao.ru/ajax/simulateSpectrum/?type=${gasObj.spectrumType}`,
		data: gasObj.spectrumData,
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': publicHttpHeader.Cookie
		},
		timeout: 7200000
	};

	reqHttp(options, (err, string) => {
		if (err) {
			cb(err);
			return;
		}
		
		saveLog(`simulateSpectrum DONE`);

		getFileNamePath(gasObj, cb);
	});
};

const submitParams = (gasObj, cb) => {
	gasObj.reqData.yt2 = "Start simulation"

	var options = {
		method: 'post',
		url: `http://hitran.iao.ru/bands/simlaunch?mol=${gasObj.gasType}`,
		data: gasObj.reqData,
		headers: publicHttpHeader,
		timeout: 7200000
	};

	reqHttp(options, (err, html) => {
		if (err) {
			cb(err);
			return;
		}
		
		saveLog(`submitParams DONE`);

		try {
			var matchString = html.match(/specParm\.simulate\(.*\);/g)[0];
			var matchArgumentsString = matchString.match(/".*?"/g);
			for (var i = 0; i < matchArgumentsString.length; i++) {
				matchArgumentsString[i] = matchArgumentsString[i].replace(/"/g, '');
			}
		} catch (e) {
			cb(e);
			return;
		}

		gasObj.spectrumType = matchArgumentsString[0];
		gasObj.spectrumData = matchArgumentsString[2];
		simulateSpectrum(gasObj, cb);
	});
};

const submitPrePage = (gasObj, cb) => {

	var pageBandList = gasObj.bandList.splice(0,40);

	gasObj.reqData["SpecParmBands[WNlow]"] = 9999999;
	gasObj.reqData["SpecParmBands[WNup]"] = 0;
	gasObj.reqData["SpecParmBands[bands]"] = '';
	gasObj.firstIds = pageBandList[0].id;
	gasObj.wnMax = pageBandList[0].WNmax;

	for (var i = 0; i < pageBandList.length; i++) {
		if (i != 0) {
			gasObj.reqData["SpecParmBands[bands]"] += ',';
		}
		gasObj.reqData["SpecParmBands[bands]"] += pageBandList[i].id;
		if (pageBandList[i].WNmin < gasObj.reqData["SpecParmBands[WNlow]"]) {
			gasObj.reqData["SpecParmBands[WNlow]"] = Math.floor(pageBandList[i].WNmin);
		}
		if (pageBandList[i].WNmax > gasObj.reqData["SpecParmBands[WNup]"]) {
			gasObj.reqData["SpecParmBands[WNup]"] = Math.ceil(pageBandList[i].WNmax);
		}
	}

	submitParams(gasObj, (err) => {
		if (pageBandList.length != 0) {
			submitPrePage(gasObj, cb);
			return;
		}
		cb();
	});
};

const getBandList = (gasObj, cb) => {
	var options = {
		method: 'post',
		url: `http://hitran.iao.ru/ajax/bandList?ds=hitran&mol=${gasObj.gasType}&isot=${gasObj.isotopologueId}`,
		data: {},
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': publicHttpHeader.Cookie
		}
	};

	reqHttp(options, (err, json) => {
		if (err) {
			cb(err);
			return;
		}

		if (json.data.length == 0) {
			cb('getBandList length 0');
			return;
		}

		saveLog(`getBandList DONE`);

		json.data.sort((a, b) => {
			return a.WNmax - b.WNmax;
		});

		gasObj.bandList = json.data;

		submitPrePage(gasObj, cb);
	});
};

const getIosList = (gasObj, cb) => {
	var options = {
		method: 'post',
		url: `http://hitran.iao.ru/ajax/isotList?ds=hitran&mol=${gasObj.gasType}`,
		data: {},
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': publicHttpHeader.Cookie
		}
	};

	reqHttp(options, (err, json) => {
		if (err) {
			cb(err);
			return;
		}

		if (json.data.length == 0) {
			cb('getIosList length 0');
			return;
		}

		saveLog(`getIosList DONE`);

		gasObj.isotopologueId = json.data[0].mi_id;
		gasObj.reqData["SpecParmBands[Tmin]"] = json.data[0].Tmin;
		gasObj.reqData["SpecParmBands[Tmax]"] = json.data[0].Tmax;
		gasObj.reqData["SpecParmBands[spFun]"] = 4;
		gasObj.reqData["SpecParmBands[C]"] = 0.001;

		if (/\(SO2\)/.test(gasObj.gasName) || /\(CF4\)/.test(gasObj.gasName)) {
			gasObj.reqData["SpecParmBands[C]"] = 0.0001;
		}

		getBandList(gasObj, cb);
	});
};

const spiderGasPage = (gasObj, cb) => {

	function objectifyForm(formArray) {

		var returnArray = {};
		for (var i = 0; i < formArray.length; i++){
			returnArray[formArray[i]['name']] = formArray[i]['value'];
		}
		return returnArray;
	}

	var options = {
		url: 'http://hitran.iao.ru/bands/simlaunch?mol=' + gasObj.gasType,
		headers: publicHttpHeader
	};

	reqHttp(options, (err, html) => {
		if (err) {
			cb(err);
			return;
		}

		saveLog(`spiderGasPage DONE`);

		var $ = cheerio.load(html);
		gasObj.reqData = objectifyForm($('#specparm-form').serializeArray());
		getIosList(gasObj, cb);
	});
};

var gasTaskQueue = [];

var processGasTaskQueueOneByOne = () => {
	if (gasTaskQueue.length == 0) {
		saveLog("ALL DONE");
		return;
	}

	var gasObj = {
		gasType: gasTaskQueue[0].gasId,
		gasName: gasTaskQueue[0].gasName
	};
	
	gasTaskQueue.splice(0,1);

	saveLog(`${gasObj.gasName} PROCESS START}`);

	spiderGasPage(gasObj, (err) => {
		if (err) {
			saveLog(err);
		}

		saveLog(`${gasObj.gasName} PROCESS DONE}`);

		setTimeout(processGasTaskQueueOneByOne, 1000);
	});

};

var publicHttpHeader = {
	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
};

const initSpiderGas = () => {
	cacheCookie = cache.get('cookie');

	if (cacheCookie) {
		publicHttpHeader.Cookie = cache.get('cookie');
	}

	console.log(publicHttpHeader);

	var options = {
		url: 'http://hitran.iao.ru/bands/simlaunch',
		headers: publicHttpHeader
	};

	reqHttp(options, (err, html, headers) => {
		if (err) {
			saveLog(err);
			return;
		}

		if (headers['set-cookie'] != null) {
			publicHttpHeader.Cookie = headers['set-cookie'][0].split(';')[0];
			cache.set('cookie', publicHttpHeader.Cookie);
		}

		var $ = cheerio.load(html);
		var gasOptions = $('#mol option');
		gasOptions.each((i, elem) => {
			gasTaskQueue.push({
				gasId: elem.attribs.value,
				gasName: elem.children[0].data.replace(/ /g, '_')
			});
		});

		processGasTaskQueueOneByOne();
	});
};

initSpiderGas();
