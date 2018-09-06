var captcha = require('canvas-captcha')
var captchaOptions = {
	charPool: ('abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + '1234567890').split(''),
	size: {
		width: 100,
		height: 32
	},
	textPos: {
		left: 10,
		top: 20
	},
	rotate: .02,
	charLength: 5,
	font: '26px Unifont',
	strokeStyle: '#4E7AC7',
	bgColor: '#ADD5F7',
	confusion: true,
	cFont: '30px Arial',
	cStrokeStyle: '#7FB2F0',
	cRotate: .05,
};

module.exports = (req, res, next) => {
	captcha(captchaOptions, (err, captchaObj) => {
		if (err) {
			console.log(err);
			res.status(404).end();
			return;
		}
		req.session.captcha = captchaObj.captchaStr.toUpperCase();
		res.end(captchaObj.captchaImg);
	});
};
