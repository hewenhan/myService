module.exports = function (req, res, next) {

	console.log(req.allParams);

	if (req.allParams.echostr != null) {
		res.send(req.allParams.echostr);
		return;
	}

	res.send('success');
};
