// // ONLINE
// const apiHosts = 'https://service.hewenhan.me/api';

// TEST
const apiHosts = '/api';

const requestApi = (path, data, cb) => {
	var apiUrl = apiHosts + '/' + path;
	$.ajax({
		url: apiUrl,
		type: "POST",
		data: data,
		dataType: 'json',
		success: (data) => {
			if (!data.success) {
				if (data.msg == 'session key empty or expired') {
					alert('登录过期或请重新登录');
					tipUserLogin();
					return;
				}
				cb(data.msg || '请求发生错误');
				return;
			}
			cb(null, data.data);
		},
		error: (err) => {
			console.log(data);
			console.log(err);
			cb(`接口"${apiUrl}" ${err.status} 错误`);
		}
	});
};

const uploadFile = (fileDomSelector, cb) => {

	if ($(fileDomSelector)[0] == null) {
		cb('文件DOM错误');
		return;
	}
	if ($(fileDomSelector)[0].files == null) {
		cb('文件DOM错误');
		return;
	}
	if ($(fileDomSelector)[0].files.length == 0) {
		cb('请选取文件');
		return;
	}

	var apiUrl = apiHosts + '/userUploadFile';

	var formData = new FormData();
	formData.append('fileUpload', $(fileDomSelector)[0].files[0]);

	$.ajax({
		url: apiUrl,
		type: "POST",
		data: formData,
		processData: false,
		contentType: false,
		success: (data) => {
			if (!data.success) {
				cb(data.msg);
				return;
			}
			cb(null, data.data);
		},
		error: (err) => {
			console.log(formData);
			console.log(err);
			cb(`接口"${apiUrl}" ${err.status} 错误`);
		}
	});
};

// const articleObj = {
// 	title: 'asda',
// 	content: 'qweqwe'
// };
const postArticle = (articleObj, cb) => {
	requestApi('postArticle', {
		title: articleObj.title,
		content: articleObj.content
	}, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const userResourceUrlParse = (url, cb) => {
	requestApi('userResourceUrlParse', {
		url: url,
	}, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const userResourceRegister = (resourceId, cb) => {
	requestApi('userResourceRegister', {
		resourceId: resourceId,
	}, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const getUserResourcePage = (startId, cb) => {
	requestApi('userResourcePagePull', {startId: startId, limit: 10}, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const userLogin = (loginData, cb) => {
	requestApi('login', loginData, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const userRegister = (registerData, cb) => {
	requestApi('register', registerData, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const userLogout = (cb) => {
	requestApi('userLogout', null, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const verifyLoginSession = (cb) => {
	requestApi('userVerifyLoginSession', {}, (err, data) => {
		if (err) {
			cb(err);
			return;
		}
		cb(null, data);
	});
};

const domEventBind = (event, dom, cb) => {

	const checkEventVaild = (eventObj) => {
		if (eventObj.length == null) {
			return false;
		}
		if (eventObj.length > 0) {
			return true;
		}
		return false;
	};

	var result = {
		length: 0
	};

	switch (event) {
		case 'click':

		result = $(dom).click(cb);
		if (!checkEventVaild(result)) {
			$(dom).ready(() => {
				result = $(dom).click(cb);
			});
		}

		break;
		default:
		debugInfo('UNKNOW EVENT');

		return;
		break;
	}

	return result;
};

const showLogin = () => {
	loginBox.show();
	$('#userLoginUserName').focus();
};
const showRegister = () => {
	registerBox.show();
	$('#userRegisterBoxUserName').focus();
};

const initMenu = (menuArr) => {
	$('#menuList').html('');
	addMenuBtn(menuArr);
};

const debugInfo = (things) => {
	console.log(things);
};

// const menuArr = [
// {title: '登录', cb: showLogin},
// {title: '音乐上传', url: 'uploadMusic'},
// {title: '资源列表', url: 'resourceList'}
// ];
const addMenuBtn = (menuArr) => {
	for (let i = 0; i < menuArr.length; i++) {

		if (menuArr[i].title == null) {
			debugInfo('addMenuBtn miss title Error');
			continue;
		}

		var onclick = '';

		var active = '';
		if (menuArr[i].url) {
			onclick = 'window.location.href="' + menuArr[i].url + '"';
			if (new RegExp(menuArr[i].url).test(window.location.href)) {
				active = 'active';
			}
		}

		if (menuArr[i].cb) {
			onclick = menuArr[i].cb.name + '()';
		}

		const menuName = menuArr[i].title;
		if (true) {}
		$('#menuList').append('\
			<div class="menuItem ' + active + '" onclick=' + onclick + '>\n\
			' + menuName + '\n\
			</div>\
			');
	}
	bindMemuEvent();
};

const bindMemuEvent = () => {
	var touchMoveSlideLockTimecount = setTimeout(() => {}, 0);
	var touchMoveSlideLock = false;
	var startX = 0;
	var startY = 0;

	const menuToggle = () => {
		$('#menu').toggle('fast');
	};
	const blockEventPop = (e) => {
		e.preventDefault();
	};
	const touchstartCb = (e) => {
		touchMoveSlideLock = false;
		startX = e.originalEvent.changedTouches[0].pageX;
		startY = e.originalEvent.changedTouches[0].pageY;
		touchMoveSlideLockTimecount = setTimeout(() => {
			touchMoveSlideLock = true;
		}, 300);
	};
	const touchendCb = (e) => {
		clearTimeout(touchMoveSlideLockTimecount);
		if (touchMoveSlideLock) {
			return;
		}
		const moveEndX = e.originalEvent.changedTouches[0].pageX;
		const moveEndY = e.originalEvent.changedTouches[0].pageY;
		const X = moveEndX - startX;
		const Y = moveEndY - startY;

		if ( Math.abs(X) > Math.abs(Y) && X > 100 ) {
		}
		else if ( Math.abs(X) > Math.abs(Y) && X < -100 ) {
			$('#menu').toggle('fast');
		}
		else if ( Math.abs(Y) > Math.abs(X) && Y > 100) {
		}
		else if ( Math.abs(Y) > Math.abs(X) && Y < -100 ) {
			$('#menu').toggle('fast');
		}
		else{

		}
		touchMoveSlideLock = true;
	};

	$('#headerMenuToggleBtn').unbind("click");
	$('#menuCover').unbind("click");
	$("#menu").unbind("touchmove");
	$("#menu").unbind("touchstart");
	$("#menu").unbind("touchend");

	$('#headerMenuToggleBtn').bind("click", menuToggle);
	$('#menuCover').bind("click", menuToggle);
	$("#menu").bind("touchmove", blockEventPop);
	$("#menu").bind("touchstart", touchstartCb);
	$("#menu").bind("touchend", touchendCb);
};

var getQueryStringByName = (name) => {
	var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if (result === null || result.length < 1) {
		return "";
	}
	return result[1];
};

var removeQueryByName = (url, name) => {
	var str = "";
	if (url.indexOf('?') != -1) {
		str = url.substr(url.indexOf('?') + 1);
	} else {
		return url;
	}
	var arr = "";
	var returnurl = "";
	var setparam = "";
	if (str.indexOf('&') != -1) {
		arr = str.split('&');
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].split('=')[0] != name) {
				returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
			}
		}
		return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
	} else {
		arr = str.split('=');
		if (arr[0] == name) {
			return url.substr(0, url.indexOf('?'));
		} else {
			return url;
		}
	}
};

const setUrlParam = (url, name, value) => {
	var splitIndex = url.indexOf("?") + 1;
	var paramStr = url.substr(splitIndex, url.length);

	var newUrl = url.substr(0, splitIndex);

	var arr = paramStr.split('&');
	for (var i = 0; i < arr.length; i++) {
		var kv = arr[i].split('=');
		if (kv[0] == name) {
			newUrl += kv[0] + "=" + value;
		} else {
			if (kv[1] != undefined) {
				newUrl += kv[0] + "=" + kv[1];
			}
		}
		if (i != arr.length - 1) {
			newUrl += "&";
		}
	}
	if (newUrl.indexOf(name) < 0) {
		newUrl += splitIndex == 0 ? "?" + name + "=" + value : "&" + name + "=" + value;
	}
	return newUrl;
};

const randomStr = (length) => {
	var length = parseInt(length);
	var str = '';
	if (length / 25 >= 1) {
		for (var i = 0; i < Math.floor(length / 25); i++) {
			str += Math.random().toString(36).substr(2, 25);
		}
	}
	str += Math.random().toString(36).substr(2, length % 25);
	return str;
};
const refash = () => {
	var url = window.location.href;
	url = setUrlParam(url, 'randomStr', randomStr(5));
	window.location.href = url;
};

const formatNumLength = (int, length) => {
	var intLength = int.toString().length;
	var freeLength = length - intLength;
	var fillStr = '';
	for (var i = 0; i < freeLength; i++) {
		fillStr += '0';
	}
	return fillStr + int.toString();
};
const customFormatTime = (timeObject, format) => {

	if (timeObject instanceof Date === false) {
		return 'Error timeObject Type';
	}

	var format = format || "%YYYY-%MM-%DD %hh:%mm:%ss:%mss";

	var YY = (timeObject.getYear() - 100).toString();
	var M = timeObject.getMonth() + 1;
	var D = timeObject.getDate();
	var h = timeObject.getHours();
	var m = timeObject.getMinutes();
	var s = timeObject.getSeconds();
	var ms = timeObject.getMilliseconds();

	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(M, 2);
	var DD = formatNumLength(D, 2);
	var hh = formatNumLength(h, 2);
	var mm = formatNumLength(m, 2);
	var ss = formatNumLength(s, 2);
	var mss = formatNumLength(ms, 3);

	var replaceArr = [
	[/\%YYYY/g, YYYY],
	[/\%MM/g, MM],
	[/\%DD/g, DD],
	[/\%hh/g, hh],
	[/\%mm/g, mm],
	[/\%mss/g, mss],
	[/\%ss/g, ss],
	[/\%YY/g, YY],
	[/\%M/g, M],
	[/\%D/g, D],
	[/\%h/g, h],
	[/\%ms/g, ms],
	[/\%m/g, m],
	[/\%s/g, s]
	];

	for (var i = 0; i < replaceArr.length; i++) {
		format = format.replace(replaceArr[i][0], replaceArr[i][1]);
	}

	return format;
};

const pageData = {};

pageData.menuArr = [
{title: '登录', cb: showLogin},
{title: '注册', cb: showRegister},
];
pageData.userInfo = {};

var loginBox;
var loginBoxProperty = {
	title: '登录',
	subTitle: `<div class="loginTipRegister"><a href="javascript:showRegister()">点击注册</a></div>`,
	content: `
	<div id="userLoginDom" class="userLoginDom">
		<div class="inputGroup">
			<div class="lable leftFloat">用户名:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userLoginUserName" type="text" placeholder=""/>
			</div>
		</div>
		<div class="inputGroup">
			<div class="lable leftFloat">密码:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userLoginUserPasswd" type="password" placeholder=""/>
			</div>
		</div>
	</div>
	`,
	confirm: (e, next) => {
		var loginData = {
			userName: $('#userLoginUserName').val(),
			passwd: $('#userLoginUserPasswd').val()
		};

		userLogin(loginData, (err, data) => {
			if (err) {
				alert(err);
				return;
			}
			alert('登录成功');
			refash();
			next();
		});
	}
};

const checkUserName = (str, title) => {
	var result = "该用户名合法";
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
	return result;
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
var checkUserPasswd = () => {
	var passwdReg = /^[A-Za-z0-9]{6,20}$/;
	if (!passwdReg.test($('#userRegisterUserPasswd').val())) {
		$('#passwdCheckResult').html("密码只能是6-20位字母数字组合");
		return;
	}
	if ($('#userRegisterUserPasswd').val() != $('#userRegisterUserPasswdCheck').val()) {
		$('#passwdCheckResult').html('密码两次输入不一致');
		return;
	}
	$('#passwdCheckResult').html('');
};
var registerBox;
var registerBoxProperty = {
	title: '注册',
	content: `
	<div id="userRegisterDom" class="userLoginDom">
		<div class="inputGroup">
			<div class="lable leftFloat">用户名:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userRegisterUserName" type="text" placeholder=""/>
			</div>
		</div>
		<div class="inputGroup">
			<div class="lable leftFloat">昵称:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userRegisterNickName" type="text" placeholder=""/>
			</div>
		</div>
		<div class="inputGroup">
			<div class="lable leftFloat">密码:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userRegisterUserPasswd" type="password" placeholder="" onkeyup="checkUserPasswd()"/>
			</div>
		</div>
		<div class="inputGroup">
			<div class="lable leftFloat">再次输入:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userRegisterUserPasswdCheck" type="password" placeholder="" onkeyup="checkUserPasswd()"/>
			</div>
			<div id="passwdCheckResult" class="inputCheckResult"></div>
		</div>
		<div class="inputGroup">
			<div class="lable leftFloat">验证码:</div>
			<div class="inputDom leftFloat">
				<input class="inputBase line-indent" id="userRegisterCaptcha" type="text" placeholder=""/>
			</div>
		</div>
		<div class="inputGroup">
			<div class="lable rightFloat">
				<img src="${apiHosts}/captcha?timestamp=0" onclick="((e) => {
					src = setUrlParam(this.src, 'timestamp', Date.now());
					this.src = src;
				})()"/>
			</div>
		</div>
	</div>
	`,
	confirm: (e, next) => {
		var registerData = {
			userName: $('#userRegisterUserName').val(),
			nickname: $('#userRegisterNickName').val(),
			passwd: $('#userRegisterUserPasswd').val(),
			passwdCheck: $('#userRegisterUserPasswdCheck').val(),
			captcha: $('#userRegisterCaptcha').val()
		};

		var passwdReg = /^[A-Za-z0-9]{6,20}$/;
		if (!passwdReg.test(registerData.passwd)) {
			alert("密码只能是6-20位字母数字组合");
			return;
		}
		if (registerData.passwd != registerData.passwdCheck) {
			alert('密码两次输入不一致');
			return;
		}

		var checkUserNameResult = checkUserName(registerData.userName, '用户名');
		if (checkUserNameResult !== '该用户名合法') {
			alert(checkUserNameResult);
			return;
		}

		var checkNicknameResult = checkUserName(registerData.nickname, '昵称');
		if (checkNicknameResult !== '该用户名合法') {
			alert(checkNicknameResult);
			return;
		}

		// tipUsrLisence();

		userRegister(registerData, (err, data) => {
			if (err) {
				alert(err);
				return;
			}
			alert('注册成功');

			var loginData = {
				userName: registerData.userName,
				passwd: registerData.passwd
			};

			userLogin(loginData, (err, data) => {
				if (err) {
					console.log(err);
					return;
				}
				refash();
				next();
			});
		});
	}
};

const logout = () => {
	userLogout(() => {
		refash();
	});
};

const tipUserLogin = () => {
	showLogin();
};

const verifyLogin = () => {
	verifyLoginSession((err, data) => {
		if (err) {
			tipUserLogin();
			return;
		}

		pageData.userInfo = data;
		document.dispatchEvent(userInfoReady);
	});
};


var userInfoReady = new CustomEvent("userInfoReady", {});

$(document).bind('userInfoReady', (e) => {
	pageData.menuArr = [
	{title: '登出', cb: logout},
	// {title: '资源上传', url: 'resourceUpload'},
	{title: '资源上传v2', url: 'resourceUploadV2'},
	// {title: '资源提取', url: 'resourcePick'},
	{title: '资源列表', url: 'resourceList'},
	{title: '打泡泡', url: 'popGame'}
	];
	initMenu(pageData.menuArr);
	$('#userNameInMenu').html(`欢迎<br>${pageData.userInfo.nickname}`);
	$('#tipMsg').html('');
});

$('.head').ready(() => {
	initMenu(pageData.menuArr);
	verifyLogin();
	loginBox = new ConfirmBox(loginBoxProperty);
	registerBox = new ConfirmBox(registerBoxProperty);
});
