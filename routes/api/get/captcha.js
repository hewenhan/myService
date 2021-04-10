const Captcha = require("@haileybot/captcha-generator");

module.exports = (req, res, next) => {
	var captcha = new Captcha();
	req.session.captcha = captcha.value;
	res.end(captcha.JPEGStream.read());
};