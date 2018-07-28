
var apiHosts = 'http://192.168.10.2:20070/api';

var requestApi = (path, data, callback) => {
	$.ajax({
		url: apiHosts + '/' + path,
		type: "POST",
		data: data,
		dataType: 'json',
		success: (data) => {
			callback(null, data);
		},
		error: (err) => {
			callback(err);
		}
	});
};

var insertMemuDom = (menuArr) => {
	for (var i = 0; i < menuArr.length; i++) {
		var menuUrl = "'" + menuArr[i].url + "'";
		var menuName = menuArr[i].title;
		$('#menuList').append('\
			<div class="menuItem" onclick="window.location.href=' + menuUrl + '">\n\
			' + menuName + '\n\
			</div>\
			');
	}
	bindMemuEvent();
};

var domEventBind = (event, dom, callback) => {

	var checkEventVaild = (eventObj) => {
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

		result = $(dom).click(callback);
		if (!checkEventVaild(result)) {
			$(dom).ready(() => {
				result = $(dom).click(callback);
			});
		}

		break;
		default:
		console.log('UNKNOW EVENT');

		return;
		break;
	}

	return result;
};

var bindMemuEvent = () => {
	var touchMoveSlideLock = false;
	var startX = 0;
	var startY = 0;
	$('#headerMenuHamburger').click((e) => {
		$('#menu').toggle('fast');
	});
	$('#headerUserHeadDiv').click((e) => {
		$('#menu').toggle('fast');
	});
	$('#menuCover').click((e) => {
		$('#menu').toggle('fast');
	});
	$("#menu").on("touchmove", (e) => {
		e.preventDefault();
	});
	$("#menu").on("touchstart", (e) => {
		touchMoveSlideLock = false;
		startX = e.originalEvent.changedTouches[0].pageX;
		startY = e.originalEvent.changedTouches[0].pageY;
		var touchMoveSlideLockTimeout = () => {
			touchMoveSlideLock = true;
		};
		touchMoveSlideLockTimecount = setTimeout(touchMoveSlideLockTimeout, 300);
	});
	$("#menu").on("touchend", (e) => {
		clearTimeout(touchMoveSlideLockTimecount);
		if (touchMoveSlideLock) {
			return;
		}
		var moveEndX = e.originalEvent.changedTouches[0].pageX;
		var moveEndY = e.originalEvent.changedTouches[0].pageY;
		var X = moveEndX - startX;
		var Y = moveEndY - startY;

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
	});
};

$('.head').ready(() => {
	var menuArr = [
	{title: 'baidu', url: 'https://baidu.com'},
	{title: 'sina', url: 'https://sina.com.cn'}
	];
	insertMemuDom(menuArr);
});
