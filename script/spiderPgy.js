var reqHttp = require("request_http");
var htmlparser  = require('htmlparser2');
var getXS = require('./spiderPgyLib/get_x_s');
var vm = require('vm');

var cookie = 'timestamp2=2022021553e1ce5e43a40cba39ecdf4d; timestamp2.sig=l2-YGIgXnpc6saI_v58ILIJXwIYEAPot4GW6cfLEBoU; customerBeakerSessionId=4bb3a1a1a9a6ef12b75e60ff24464613b819d0a8gAJ9cQAoWBAAAABjdXN0b21lclVzZXJUeXBlcQFLA1gOAAAAX2NyZWF0aW9uX3RpbWVxAkdB2ILUay2yLVgJAAAAYXV0aFRva2VucQNYQQAAADQ0YzY3YWJkMWY3MjQzOTE5NzA3NWI1YTE0NDUyYzJmLTBiOTliYTdlZTIzZTQ4MDQ5ZDUyNWM3YzhmNWJiM2I3cQRYAwAAAF9pZHEFWCAAAABhYTcwODVlNzAyY2E0YThhYmMzZTkxZjRhMjJlYTczNnEGWA4AAABfYWNjZXNzZWRfdGltZXEHR0HYgtRrLbItWAYAAAB1c2VySWRxCFgYAAAANjEzNWE3ZTVjNTk1ZmEwMDAxOWFjMzVjcQl1Lg==; customerClientId=108451733278000; solar.beaker.session.id=1644908972879023922829';

var getFValue = () => {
	var options = {
		url: 'https://pgy.xiaohongshu.com/solar/advertiser/patterns/kol',
		"headers": {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"cookie": cookie
		}
	};

	return new Promise((resolve, reject) => {
		reqHttp(options, (err, data) => {
			if (err) {
				return reject(err);
			}

			vm.runInThisContext(data, 'remote_modules/hello.js');
			var hello = require('remote_modules/hello.js');
			console.log(hello);

			var start = false;
			var parser = new htmlparser.Parser({
				onopentag: (tagname, attribs) => {
					if(tagname !== "script"){
						start = false;
						return;
					}
					start = true;
				},
				ontext: (text) => {
					if (!start) {
						return;
					}
					var patt = /function f\(\)/;
					if (!patt.test(text)) {
						return;
					}
					var patt = /'.*?'/;
					var f = patt.exec(text)[0];

					return resolve(f);
				}
			}, {decodeEntities: true});
			parser.write(data);
			parser.end();
		});
	});
};

var getMcnList = () => {
	var url = "https://pgy.xiaohongshu.com/api/solar/cooperator/mcns?sort=&column=&pageNum=1&pageSize=20";
	console.log('1');
	// var data = getXS;
	console.log('2');
	console.log(getXS(null, url));
	return;
	var options = {
		url: url,
		headers: {
			"accept": "application/json, text/plain, */*",
			"f": "80",
			"x-s": XS,
			"x-t": XT,
			cookie: cookie
		}
	};

	console.log(options);

	reqHttp(options, (err, data) => {
		if (err) {
			console.log(err);
			return;
		}
		if (!data.success) {
			console.log(data);
			return;
		}
		var mcnList = data.data.mcns;
		console.log(mcnList);
	});
};

getFValue().then(f => {
	console.log(f);
}).catch(err => {
	console.error(err)
});

// getMcnList();
