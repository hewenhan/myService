var lastId;
var hasNext = false;
var pendLock = false;

var showResourceDescription = (id) => {
	$('.resourceDescriptionDom').slideUp('fast');
	var thisStatus = document.getElementById('resourceDescriptionId_' + id).style.display;

	var mediaLists = $('.previewMedia');
	for (var i = 0; i < mediaLists.length; i++) {
		mediaLists[i].pause();
	}

	if (thisStatus == 'block') {
		return;
	}
	$('#resourceDescriptionId_' + id).slideToggle('fast', () => {
		if ($(`img#previewMedia_${id}`).attr('src') !== $(`img#previewMedia_${id}`).attr('data-original')) {
			$(`img#previewMedia_${id}`).lazyload({
				effect: "fadeIn"
			});
		}
		var holderHeight = document.getElementsByClassName('fixedStick')[0].offsetHeight;
		var height = document.getElementById('resourceId_' + id).offsetTop - holderHeight;
		$('html,body').animate({scrollTop: height + 'px'}, 'fast');
	});
};

var initCopyResourceUrl = (btnSelector, resourceId) => {
	var resourceUrlDom = $(`#resourceId_${resourceId} .resourceUrl`);
	var clipboard = new ClipboardJS(btnSelector, {
		text: () => {
			return resourceUrlDom.html();
		}
	});

	clipboard.on('success', (e) => {
		alert(`复制成功`);
	});

	clipboard.on('error', (e) => {
		console.log(e);
		alert(`不知道咋咧？没复制上！`);
	});
};

var deleteResource = (resourceId) => {
	var resourceNameDom = $(`#resourceId_${resourceId} .resourceName`);
	var resourceName = resourceNameDom.html();
	console.log(resourceName);

	if (!confirm('删除资源:\n' + resourceName + '\n您确定吗？\n您资源列表中的所有相同资源都会被删除哦！\n(资源对比已资源的md5值为准)')) {
		return;
	}

	deleteResourceReq(resourceId, (err, data) => {
		if (err) {
			alert(err);
			return;
		}

		alert(resourceName + ' 已经删除完成');
		refash();
	});
};

var downloadResource = (resourceId) => {
	var resourceUrlDom = $(`#resourceId_${resourceId} .resourceUrl`);
	var url = resourceUrlDom.html();
	window.open(url);
};

var getResourceList = (startId) => {
	getUserResourcePage(startId, (err, data) => {
		if (err) {
			alert(err);
			return;
		}
		var resourceList = data.resourceList;
		for (var i = 0; i < resourceList.length; i++) {
			var resource = resourceList[i];
			var mediaType = 'None';

			var resourcePreviewHtml = `不支持的预览类型`;

			if (/audio/.test(resource.mimetype)) {
				resourcePreviewHtml = `
				<audio id="previewMedia_${resource.id}" class="previewMedia" src="${resource.url}" preload="none" controls="controls"></audio>
				`;
				mediaType = 'audio';
			}
			if (/image/.test(resource.mimetype)) {
				resourcePreviewHtml = `
				<img id="previewMedia_${resource.id}" class="previewImg" src="https://static.hewenhan.me/userFiles/2a342e345897fb6615e067f078463fc58a13dd8cfe2015aed1847312b79dabff.gif" data-original="${resource.url}" />
				`;
				mediaType = 'image';
			}
			if (/video/.test(resource.mimetype)) {
				resourcePreviewHtml = `
				<video id="previewMedia_${resource.id}" class="previewMedia" src="${resource.url}" preload="none" controls="controls"></video>
				`;
				mediaType = 'video';
			}

			$('#tableList').append(`
				<div class="tableCell" id="resourceId_${resource.id}">
				<div onclick="showResourceDescription(${resource.id})">
				<div class="tableLine">
				<div class="tableTitle">资源名</div>
				<div class="tableLineCell1 resourceName">${resource.filename}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源类型</div>
				<div class="tableLineCell1">${resource.mimetype}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源地址</div>
				<div class="tableLineCell1 resourceUrl">${resource.url}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">资源MD5</div>
				<div class="tableLineCell1">${resource.md5}</div>
				</div>
				<div class="tableLine">
				<div class="tableTitle">上传时间</div>
				<div class="tableLineCell3">${customFormatTime(new Date(resource.create_time), '%YYYY-%MM-%DD %hh:%mm:%ss')}</div>
				<div class="tableTitle pointer" onclick="deleteResource(${resource.id})">删除资源</div>
				</div>
				</div>
				<div id="resourceDescriptionId_${resource.id}" class='resourceDescriptionDom'>
				<div class="tableLine">
				<div class="tableTitle">资源预览</div>
				<div class="tableLineCell1">
				${resourcePreviewHtml}
				</div>
				</div>
				<div class="tableLine">
				<div class="pointer tableTitle2" id="copyResourceUrlBtn_${resource.id}">复制链接</div>
				<div class="pointer tableTitle2" onclick="downloadResource(${resource.id})">下载资源</div>
				</div>
				</div>
				</div>
				`);

			initCopyResourceUrl(`#copyResourceUrlBtn_${resource.id}`, resource.id);

			var mediaDom = $(`#previewMedia_${resource.id}`);
			switch (mediaType) {
				case 'audio':

				break;
				case 'image':
				case 'video':

				mediaDom.parents('.tableLine').css('height', 'auto');
				break;
				default:
			}

		}
		lastId = data.lastId;
		hasNext = data.hasNext;
		pendLock = false;
	});
};

window.onscroll = () => {
	if (hasNext && !pendLock) {
		if (window.scrollY + window.document.documentElement.clientHeight >= document.body.scrollHeight - 100) {
			pendLock = true;
			getResourceList(lastId);
		}
	}
};

$(document).ready(() => {
	getResourceList(0);
});
