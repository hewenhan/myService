var lastId;
var hasNext = false;
var pendLock = false;

var getResourceList = function (startId) {
	getUserResourcePage(startId, (err, data) => {
		if (err) {
			alert(err);
			return;
		}
		var resourceList = data.resourceList;
		for (var i = 0; i < resourceList.length; i++) {
			var resource = resourceList[i];
			$('#tableList').append(`
				<div class="tableCell">
				<div class="tableLine">
				<div class="tableTitle">资源名</div>
				<div class="tableLineCell1">${resource.filename}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源类型</div>
				<div class="tableLineCell1">${resource.mimetype}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源地址</div>
				<div class="tableLineCell1">${resource.url}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源MD5</div>
				<div class="tableLineCell1">${resource.md5}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">上传时间</div>
				<div class="tableLineCell1">${customFormatTime(new Date(resource.create_time), '%YYYY-%MM-%DD %hh:%mm:%ss')}</div>
				</div>
				</div>
				`);
		}
		lastId = data.lastId;
		hasNext = data.hasNext;
		pendLock = false;
	});
};

window.onscroll = function () {
	if (hasNext && !pendLock) {
		if (window.scrollY + window.document.documentElement.clientHeight >= document.body.scrollHeight - 100) {
			pendLock = true;
			getResourceList(lastId);
		}
	}
};

$(document).ready(function () {
	getResourceList(0);
});