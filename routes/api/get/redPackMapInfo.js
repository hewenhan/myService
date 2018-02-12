var getYyRidInfo = function (req, res) {
	var getYyRidInfoSql = `
	SELECT 
	shop.class_name AS title,
	province.name AS province,
	city.name AS city,
	shop.address AS address,
	shop.lat AS lat,
	shop.lng AS lng
	FROM
	cloudpoint_erp.erp_shop AS shop
	LEFT JOIN cloudpoint_erp.erp_conf_region AS area
	ON area.id = shop.area_id
	LEFT JOIN cloudpoint_erp.erp_city AS city
	ON city.code = area.city
	LEFT JOIN cloudpoint_erp.erp_city AS province
	ON province.code = area.province
	WHERE
	shop.area_id = ${req.thisData.rid}
	AND shop.contract_id != ''
	`;

	query(getYyRidInfoSql, function (err, rows) {
		if (err) {
			res.error(`getYyRidInfoError`);
			return;
		}

		res.success({
			mapInfo: rows
		});
	});
};
var getYcRidInfo = function (req, res) {
	var getYcRidInfoSql = `
	SELECT 
	shop.shop_name AS title,
	province.name AS province,
	city.name AS city,
	shop.address AS address,
	shop.lat AS lat,
	shop.lng AS lng
	FROM
	club_2g.shopinfo AS shop
	LEFT JOIN club_2g.city AS city
	ON city.code = shop.city
	LEFT JOIN club_2g.city AS province
	ON province.code = shop.province
	WHERE
	partner_id = ${req.thisData.rid}
	AND is_valid = 1
	`;

	query(getYcRidInfoSql, function (err, rows) {
		if (err) {
			res.error(`getYcRidInfoError`);
			return;
		}

		res.success({
			mapInfo: rows
		});
	});
};

module.exports = function (req, res, next) {
	req.verifyParams({
		"id": "*"
	}, function (rejected) {
		if (rejected) {
			return;
		}

		var checkIdentityJson = {
			tableName: "uu.marketing_redpack",
			field: ['identity', 'rid'],
			where: {
				id: req.allParams.id
			}
		};

		select(checkIdentityJson, function (err, rows) {
			if (err) {
				res.error(`checkIdentityError`);
				return;
			}
			if (rows.length == 0) {
				res.error(`checkIdEmpty`);
				return;
			}

			req.thisData = rows[0];
			if (req.thisData.identity == "yy") {
				getYyRidInfo(req, res);
				return;
			}

			if (req.thisData.identity == "yc") {
				getYcRidInfo(req, res);
				return;
			}
			res.error(`PARAMS identity UNKNOW`);
			return;
		});
	});
};
