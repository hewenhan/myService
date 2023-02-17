const puppeteer = require('puppeteer');
const tough     = require('tough-cookie');

var Cookie      = tough.Cookie;

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36';
var url = 'https://pgy.xiaohongshu.com/solar/advertiser/patterns/kol';

var str_obj = (str) => {
	str = str.split(', ');
	var result = {};
	for (var i = 0; i < str.length; i++) {
		var cur = str[i].split('=');
		result[cur[0]] = cur[1];
	}
	return result;
}

var cookieStr = 'timestamp2=2022021553e1ce5e43a40cba39ecdf4d; timestamp2.sig=l2-YGIgXnpc6saI_v58ILIJXwIYEAPot4GW6cfLEBoU; customerClientId=108451733278000; solar.beaker.session.id=1644908972879023922829';
// var cookieObj = Cookie.parse(cookieStr);
console.log(str_obj(cookieStr));

return;
var spider = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setUserAgent(userAgent);
	// await page.setCookie(Cookie.parse(cookie));
	await page.goto(url);

	const dimensions = await page.evaluate(() => {
		return document.title;
	});

	console.log(await page.userAgent());
	console.log(dimensions);

	await browser.close();
};

spider();
