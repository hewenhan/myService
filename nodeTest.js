async function run () {

	var chrome = require('nodejs-chrome');
	var browser = await chrome({
		device: {
			userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
		}
	});
	try {
		var page = await browser.tabnew();
		await page.setUrl('https://v.douyin.com/R3nfaJU/');
		var text = await page.text();
		await page.screenshot({path: 'screenshot.png'});
		console.log(text);
		browser.exit();
	} catch (e) {
		console.log(e);
	}

}

run();