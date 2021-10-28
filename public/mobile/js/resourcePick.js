var resourceInfo;

const showParseDone = () => {
	var html = `艺术家: ${resourceInfo.artist}
资源类型: ${resourceInfo.mimetype}
资源名称: ${resourceInfo.name}
资源地址: ${resourceInfo.resourceUrl}`;

	$('#resourceParsedResult').html(html);
	$('#parseStat').html('解析完成!');
	$('#parseStat').removeClass();
	$('#parseStat').addClass('parseStatDone');
};

const parseResource = () => {
	var url = $('#urlResourceInput').val().trim();

	$('#parseStat').html('解析中..');
	$('#parseStat').removeClass();
	$('#parseStat').addClass('parseStatRuning');

	userResourceUrlParse(url, (err, data) => {
		if (err) {
			$('#parseStat').html('解析错误--');
			$('#parseStat').removeClass();
			$('#parseStat').addClass('parseStatError');
			alert(err);
			return;
		}
		resourceInfo = data;
		showParseDone();
	});
};

const storeUserResource = () => {
	if (resourceInfo == null) {
		alert('请先解析资源');
		return;
	}
	userResourceRegister(resourceInfo.resourceId, (err, data) => {
		if (err) {
			alert(err);
			return;
		}
		alert('资源加入成功');
		refash();
	});
};

domEventBind('click', '#parseResourceBtn', (e) => {
	parseResource();
});

domEventBind('click', '#putResourceBtn', (e) => {
	storeUserResource();
});


// function loadDoc() {
// 	xhttp = new XMLHttpRequest();
// 	xhttp.responseType = 'blob';
// 	xhttp.onreadystatechange = function() {
// 		if (this.readyState == 4 && this.status == 200) {
// 			console.log('111');
// 		}
// 	};
// 	xhttp.open("GET", "https://static.hewenhan.me/userFiles/a877a4e0266a1c778951ea6dd3d3c450d9732ba8e75406b0101aba1f932bbd96.mp4", true);
// 	xhttp.send();
// }

// var f = new File([xhttp.response], "hahha.mp4", {type: 'video/mp4', lastModified: new Date()})

// uploadFileList.xid27.file = f

// ...