var getAreaOrPartnerRedPackInfo = function (req, res) {
	var getAreaOrPartnerRedPackInfoJson = {
		tableName: 'uu.marketing_redpack',
		where: {
			identity: req.allParams.identity,
			rid: req.allParams.rid
		}
	};

	select(getAreaOrPartnerRedPackInfoJson, function (err, rows) {
		if (err) {
			res.error('getAreaOrPartnerRedPackInfoError');
			return;
		}

		for (var i = 0; i < rows.length; i++) {

			var nowDate = new Date();
			var endTime = new Date(rows[i].end_time);
			var startTime = new Date(rows[i].start_time);

			rows[i].expired = false;
			
			if (nowDate > endTime || rows[i].num_left == 0 || rows[i].points_left == 0) {
				rows[i].status_describe = 'ended';
				rows[i].expired = true;
			} else if (nowDate < startTime) {
				rows[i].status_describe = 'standBy';
			} else {
				rows[i].status_describe = 'actived';
			}

			if (rows[i].status == 0) {
				rows[i].status_describe = 'forbidden';
			}

			rows[i].writable = false;

			if (nowDate < startTime) {
				rows[i].writable = true;
			}
		}

		res.success({redPackList: rows});
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"identity": "*",
		"rid": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		getAreaOrPartnerRedPackInfo(req, res);
	});
};
