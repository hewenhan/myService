// ONLINE
const apiHosts = 'https://service.hewenhan.me/api';

// // TEST
// const apiHosts = '/api';

const requestApi = (path, data, cb) => {
	var apiUrl = apiHosts + '/' + path;
	$.ajax({
		url: apiUrl,
		type: "POST",
		data: data,
		dataType: 'json',
		success: (data) => {
			if (!data.success) {
				cb(data.msg);
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
	loginData.passwd = CryptoJS.SHA256(loginData.passwd).toString(CryptoJS.enc.Hex);
	requestApi('login', loginData, (err, data) => {
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

		if (menuArr[i].url) {
			onclick = 'window.location.href="' + menuArr[i].url + '"';
		}

		if (menuArr[i].cb) {
			onclick = menuArr[i].cb.name + '()';
		}

		const menuName = menuArr[i].title;
		$('#menuList').append('\
			<div class="menuItem" onclick=' + onclick + '>\n\
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

var formatNumLength = function (int, length) {
	var intLength = int.toString().length;
	var freeLength = length - intLength;
	var fillStr = '';
	for (var i = 0; i < freeLength; i++) {
		fillStr += '0';
	}
	return fillStr + int.toString();
};
var customFormatTime = function (timeObject, format) {

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
];
pageData.userInfo = {};

var loginBox;
var loginBoxProperty = {
	title: '登录',
	content: `
	<div id="userLoginDom" class="userLoginDom">
	<div class="inputGroup">
	<div class="lable leftFloat">用户名:</div>
	<div class="inputDom leftFloat">
	<input class="inputBase" id="userLoginUserName" type="text" placeholder=""/>
	</div>
	</div>
	<div class="inputGroup">
	<div class="lable leftFloat">密码:</div>
	<div class="inputDom leftFloat">
	<input class="inputBase" id="userLoginUserPasswd" type="password" placeholder=""/>
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
			pageData.userInfo = data;
			document.dispatchEvent(userInfoReady);
			alert('登录成功');
			next();
		});
	}
};

var verifyLogin = () => {
	verifyLoginSession((err, data) => {
		if (err) {
			if (window.location.pathname != '/mobile/index') {
				window.location.href = 'index';
			}
			return;
		}

		pageData.userInfo = data;
		document.dispatchEvent(userInfoReady);
	});
};


var userInfoReady = new CustomEvent("userInfoReady", {});

$(document).bind('userInfoReady', (e) => {
	pageData.menuArr = [
	{title: '资源上传', url: 'resourceUpload'},
	{title: '资源列表', url: 'resourceList'}
	];
	initMenu(pageData.menuArr);
	$('#userNameInMenu').html(`欢迎<br>${pageData.userInfo.nickname}`);
});

$('.head').ready(() => {
	initMenu(pageData.menuArr);
	verifyLogin();
	loginBox = new ConfirmBox(loginBoxProperty);
});
