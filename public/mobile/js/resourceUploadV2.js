var client;
var blob = window.URL || window.webkitURL;
if (!blob) {
	console.log('Your browser does not support Blob URLs :(');
}

var initCopyResourceUrl = (btnSelector, resourceId) => {
	var resourceUrlDom = $(`#uploadFileInfo_${resourceId} .resourceUrl`);
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

var processInputUploadFile = (file) => {
	var uploadFileId = randomStr(5);
	uploadFileList[uploadFileId] = {
		uploadFileId: uploadFileId,
		fileName: file.name,
		file: file,
		mimeType: file.type,
		localSrc: blob.createObjectURL(file),
		isUpload: false
	}

	var reader = new FileReader();
	reader.onload = function (e) {
		var hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.result));
		uploadFileList[uploadFileId].md5 = hash.toString(CryptoJS.enc.Hex);
		$(`#uploadFileInfo_${uploadFileId} .md5`).html(uploadFileList[uploadFileId].md5)
	};
	reader.readAsBinaryString(file);

	var mediaType = 'None';
	var resourcePreviewHtml = `不支持的预览类型`;
	if (/audio/.test(uploadFileList[uploadFileId].mimeType)) {
		resourcePreviewHtml = `
		<audio class="previewMedia" src="${uploadFileList[uploadFileId].localSrc}" preload="none" controls="controls"></audio>
		`;
		mediaType = 'audio';
	}
	if (/image/.test(uploadFileList[uploadFileId].mimeType)) {
		resourcePreviewHtml = `
		<img class="previewImg" src="${uploadFileList[uploadFileId].localSrc}" />
		`;
		mediaType = 'image';
	}
	if (/video/.test(uploadFileList[uploadFileId].mimeType)) {
		resourcePreviewHtml = `
		<video class="previewMedia" src="${uploadFileList[uploadFileId].localSrc}" preload="none" controls="controls"></video>
		`;
		mediaType = 'video';
	}

	$('#uploadFileListId').prepend(`
	<div class="tableCell" id="uploadFileInfo_${uploadFileId}">
	<div class="tableLine">
	<div class="tableTitle">资源名</div>
	<div class="tableLineCell1">${uploadFileList[uploadFileId].fileName}</div>
	</div>
	<div class="tableLine">
	<div class="tableTitle">资源类型</div>
	<div class="tableLineCell2">${uploadFileList[uploadFileId].mimeType}</div>
	<div class="tableTitle">上传状态</div>
	<div class="tableLineCell2 uploadStat">未上传</div>
	</div>
	<div class="tableLine">
	<div class="tableTitle">资源地址</div>
	<div class="tableLineCell1 resourceUrl">上传后获得</div>
	</div>
	<div class="tableLine">
	<div class="tableTitle">MD5</div>
	<div class="tableLineCell1 md5">计算中...</div>
	</div>
	<div class="tableLine" id="previewMedia_${uploadFileId}">
	<div class="tableTitle">资源预览</div>
	<div class="tableLineCell1">
	${resourcePreviewHtml}
	</div>
	</div>
	<div class="tableLine">
	<div class="pointer tableTitle2" id="copyResourceUrlBtn_${uploadFileId}">复制链接</div>
	<div class="pointer tableTitle2" onclick="uploadFileFn('${uploadFileId}')">点击上传</div>
	</div>
	`);

	initCopyResourceUrl(`#copyResourceUrlBtn_${uploadFileId}`, uploadFileId);

	switch (mediaType) {
		case 'audio':

		break;
		case 'image':
		case 'video':

		$(`#previewMedia_${uploadFileId}`).css('height', 'auto');
		break;
		default:
	}
};

var notifyUploadSuccess = (fileObj) => {
	requestApi('userUploadFileDone', {
		url: fileObj.url
	}, (err, data) => {
		if (err) {
			alert(err);
			return;
		}
		$(`#uploadFileInfo_${fileObj.uploadFileId} .uploadStat`).html('上传完成');
		$(`#uploadFileInfo_${fileObj.uploadFileId} .resourceUrl`).html(fileObj.url);
	});
};

var uploadFileToOss = (fileObj) => {
	$(`#uploadFileInfo_${fileObj.uploadFileId} .uploadStat`).html('上传中');
	client.multipartUpload(fileObj.storeAs, fileObj.file).then(function (result) {
		notifyUploadSuccess(fileObj);
		console.log(result);
	}).catch(function (err) {
		alert('上传失败');
		console.log(err);
		fileObj.isUpload = false;
		$(`#uploadFileInfo_${fileObj.uploadFileId} .uploadStat`).html('上传失败');
	});
};

var getPreUploadFileInfo = (fileObj) => {
	requestApi('userPreUploadFile', {
		fileName: fileObj.fileName,
		md5: fileObj.md5,
		mimeType: fileObj.mimeType
	}, (err, data) => {
		if (err) {
			alert(err);
			return;
		}

		fileObj.storeAs = data.storeAs;
		fileObj.url = data.url;

		if (data.reapeat) {
			notifyUploadSuccess(fileObj);
			return;
		}

		uploadFileToOss(fileObj);
	});
};

var uploadFileFn = (uploadFileId) => {
	var fileObj = uploadFileList[uploadFileId]
	if (fileObj.isUpload) {
		alert('文件上传中或已上传完成');
		return;
	}
	fileObj.isUpload = true;
	getPreUploadFileInfo(fileObj);
};

requestApi('requestStsInfo', {}, (err, data) => {
	if (err) {
		console.log(err);
		alert('get sts info error');
	}
	client = new OSS({
		accessKeyId: data.AccessKeyId,
		accessKeySecret: data.AccessKeySecret,
		stsToken: data.SecurityToken,
		region: 'oss-cn-beijing',
		bucket: 'my-service-static'
	});
	console.log(client);
});

var uploadFileList = {};

$(document).ready(() => {
	document.getElementById('fileInput').addEventListener('change', function (e) {
		for (var i = 0; i < e.target.files.length; i++) {
			var file = e.target.files[i];
			processInputUploadFile(file);
		}
	});
	document.getElementById('uploadBtn').addEventListener('click', function (e) {
		console.log(e);
		$('#fileInput').click()
	});
});