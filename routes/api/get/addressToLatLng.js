module.exports = function (req, res, next) {
	req.verifyParams({
		"address": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		var options = {
			url: "http://api.map.baidu.com/geocoder/v2/",
			data: {
				address: req.allParams.address,
				output: "json",
				ak: "Wd2qkR67QKq3v1C51Fv34TXsAbHb9GFF"
			}
		};

		reqHttp(options, function (err, data) {
			if (err) {
				res.error(`addressToLatLngError`);
				return;
			}
			if (data.status != 0) {
				res.error(`addressToLatLngError ${data.message}`);
				return;
			}
			res.success(data.result);
		});
	});
};
