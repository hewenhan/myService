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

var convertFileSize = (fileObj) => {
	if (fileObj.fileSize < 100) {
		fileObj.fileSize = Math.round(fileObj.fileSize * 100) / 100
		return;
	}
	fileObj.fileSize = fileObj.fileSize / 1024;
	switch (fileObj.fileSizeUnit) {
		case 'B':
		fileObj.fileSizeUnit = 'KB';
		break;

		case 'KB':
		fileObj.fileSizeUnit = 'MB';
		break;
		
		case 'MB':
		fileObj.fileSizeUnit = 'GB';
		break;
		
		case 'GB':
		fileObj.fileSizeUnit = 'TB';
		break;
		
		case 'TB':
		fileObj.fileSizeUnit = 'PB';
		break;
		
		case 'PB':
		fileObj.fileSizeUnit = 'EB';
		break;
	}
	return convertFileSize(fileObj);
};

var updateUploadFileStat = () => {
	var listLength = Object.keys(uploadFileList).length;
	var uploadedLenght = 0;

	for (var i in uploadFileList) {
		if (uploadFileList[i].uploadStat == 'uploaded') {
			uploadedLenght ++;
		}
	}
	$('#fileListStat').html(`${uploadedLenght}/${listLength}`);
};
var processInputUploadFile = (file) => {
	var uploadFileId = randomStr(5);
	uploadFileList[uploadFileId] = {
		uploadFileId: uploadFileId,
		fileName: file.name,
		file: file,
		mimeType: file.type,
		localSrc: blob.createObjectURL(file),
		uploadStat: 'wait', // wait, uploading, uploaded, failed
		fileSize: file.size,
		fileSizeUnit: 'B'
	};
	updateUploadFileStat();
	convertFileSize(uploadFileList[uploadFileId]);
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
	<div class="tableLineCell1">${uploadFileList[uploadFileId].mimeType}</div>
	</div>
	<div class="tableLine">
	<div class="tableTitle uploadStat">未上传</div>
	<div class="tableLineCell1 uploadProgress">
	<div class="progressBar"></div>
	<div class="progressPresent">0/${uploadFileList[uploadFileId].fileSize}${uploadFileList[uploadFileId].fileSizeUnit}<br>0.00%</div>
	</div>
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
		$(`#uploadFileInfo_${fileObj.uploadFileId} .progressPresent`).html(`${fileObj.fileSize}/${fileObj.fileSize}${fileObj.fileSizeUnit}<br>100%`);
		$(`#uploadFileInfo_${fileObj.uploadFileId} .progressBar`).css({ opacity: 1, width: '100%' });
		fileObj.uploadStat = 'uploaded';
		updateUploadFileStat();
	});
};

var uploadFileToOss = (fileObj) => {
	$(`#uploadFileInfo_${fileObj.uploadFileId} .uploadStat`).html('上传中');
	client.multipartUpload(fileObj.storeAs, fileObj.file, {
		progress: function (p, checkpoint) {
			var present = (p * 100).toFixed(2) * 1;
			var currentUploadSize = (p * fileObj.fileSize).toFixed(2);
			var progressVal = `${currentUploadSize}/${fileObj.fileSize}${fileObj.fileSizeUnit}`
			var opacity = (Math.round((0.5 + p / 2) * 100) / 100).toFixed(2);
			$(`#uploadFileInfo_${fileObj.uploadFileId} .progressPresent`).html(`${progressVal}<br>${present}%`);
			$(`#uploadFileInfo_${fileObj.uploadFileId} .progressBar`).css({ opacity: opacity, width: present });
		}
	}).then(function (result) {
		notifyUploadSuccess(fileObj);
		console.log(result);
	}).catch(function (err) {
		alert('上传失败');
		console.log(err);
		fileObj.uploadStat = 'failed';
		$(`#uploadFileInfo_${fileObj.uploadFileId} .uploadStat`).html('上传失败');
		updateUploadFileStat();
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

var uploadAllFiles = () => {
	for (var i in uploadFileList) {
		if (uploadFileList[i].uploadStat == 'uploaded' || uploadFileList[i].uploadStat == 'uploading') {
			continue;
		}
		uploadFileFn(i);
	}
};

var uploadFileFn = (uploadFileId) => {
	var fileObj = uploadFileList[uploadFileId]
	if (fileObj.uploadStat == 'uploading') {
		alert(fileObj.fileName + '文件上传中');
		return;
	}
	if (fileObj.uploadStat == 'uploaded') {
		alert(fileObj.fileName + '文件已上传完成');
		return;
	}
	fileObj.uploadStat = 'uploading';
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