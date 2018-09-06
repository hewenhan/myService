var insertUserInfo = (req, res) => {
	var insertUserInfoJson = {
		tableName: 'service.user',
		data: {
			name: req.allParams.userName,
			nickname: req.allParams.nickname,
			password: crypto.createHash('sha256').update(req.allParams.passwd).digest('hex'),
			register_ip: req.headers['x-real-ip'],
			from_user: 0
		}
	};

	insert(insertUserInfoJson, (err) => {
		if (err) {
			res.error('创建用户出错');
			return;
		}
		res.success();
	});
};

var checkUserNameExist = (req, res) => {
	var checkUserNameExistJson = {
		tableName: 'service.user',
		field: ['id'],
		where: {
			name: req.allParams.userName
		},
		limit: 1
	};
	select(checkUserNameExistJson, (err, rows) => {
		if (err) {
			res.error('检查用户名出错');
			return;
		}
		if (rows.length > 0) {
			res.error('用户名已存在');
			return;
		}

		insertUserInfo(req, res);
	});
};

const checkSpecialChar = (str) => {
	var arr = ["&", "\\", "/", "*", ">", "<", "@", "!"];
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < str.length; j++) {
			if (arr[i] == str.charAt(j)) {
				return true;
			}
		}
	}   
	return false;
};
var checkUserName = (str, title) => {
	var result = false;
	if ("" == str) {
		result = title + "为空";
		return result;
	} else if ((str.length < 5) || (str.length > 20)) {
		result = title + "必须为5 ~ 20位";
		return result;
	} else if (checkSpecialChar(str)) {
		result = title + "不能含有特殊字符";
		return result;
	}
	return true;
};

module.exports = (req, res, next) => {
	req.verifyParams({
		"userName": "*",
		"nickname": "*",
		"passwd": "*",
		"captcha": "*"
	}, (rejected) => {
		if (req.allParams.captcha.toUpperCase() != req.session.captcha) {
			res.error('验证码错误');
			return;
		}

		var checkUserNameResult = checkUserName(req.allParams.userName, '用户名');
		if (checkUserNameResult !== true) {
			res.error(checkUserNameResult);
			return;
		}
		var checkUserNameResult = checkUserName(req.allParams.nickname, '昵称');
		if (checkUserNameResult !== true) {
			res.error(checkUserNameResult);
			return;
		}
		var passwdReg = /^[A-Za-z0-9]{6,20}$/;
		if (!passwdReg.test(req.allParams.passwd)) {
			res.error("密码只能是6-20位字母数字组合");
			return;
		}

		checkUserNameExist(req, res);
	});
};
