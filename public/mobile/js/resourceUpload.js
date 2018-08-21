const uploadUserResource = () => {
	uploadFile('#fileInput', (err, data) => {
		if (err) {
			alert(err);
			return;
		}
		alert('上传成功');
	});
};

domEventBind('click', '#uploadBtn', (e) => {
	uploadUserResource();
});


const initUploadDom = () => {
	var uploadButton = $('<button/>')
	.addClass('btn btn-primary')
	.prop('disabled', true)
	.text('Processing...')
	.on('click', function () {
		var $this = $(this),
		data = $this.data();
		$this
		.off('click')
		.text('Abort')
		.on('click', function () {
			$this.remove();
			data.abort();
		});
		data.submit().always(function () {
			$this.remove();
		});
	});
	$('#fileupload').fileupload({
		url: '/api/userUploadFile',
		dataType: 'json',
		autoUpload: false,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp3|mp4)$/i,
		maxFileSize: 0,
		disableImageResize: /Android(?!.*Chrome)|Opera/
		.test(window.navigator.userAgent),
		previewMinWidth: 100,
		previewMaxWidth: 300,
		previewMinHeight: 100,
		previewMaxHeight: 300,
		previewCrop: true
	}).on('fileuploadadd', function (e, data) {
		data.context = $('<div/>').appendTo('#files');
		$('#progressInfo').html(0 + '%');
		$.each(data.files, function (index, file) {
			var node = $('<p/>')
			.append($('<span/>').text(file.name));
			if (!index) {
				node
				.append('<br>')
				.append(uploadButton.clone(true).data(data));
			}
			node.appendTo(data.context);
		});
	}).on('fileuploadprocessalways', function (e, data) {
		var index = data.index,
		file = data.files[index],
		node = $(data.context.children()[index]);
		if (file.preview) {
			node
			.prepend('<br>')
			.prepend(file.preview);
		}
		if (file.error) {
			node
			.append('<br>')
			.append($('<span class="text-danger"/>').text(file.error));
		}
		if (index + 1 === data.files.length) {
			data.context.find('button')
			.text('Upload')
			.prop('disabled', !!data.files.error);
		}
	}).on('fileuploadprogressall', function (e, data) {
		var progress = parseInt(data.loaded / data.total * 100, 10);
		$('#progressInfo').html(progress + '%');
	}).on('fileuploaddone', function (e, data) {
		if (!data.result.success) {
			$('#progressInfo').html('上传失败: \n' + data.result.msg);
			alert('上传失败: \n' + data.result.msg);
			return;
		}
		$('#progressInfo').html('上传成功: \n' + data.result.data.url);
		$.each(data.result.files, function (index, file) {
			if (file.url) {
				var link = $('<a>')
				.attr('target', '_blank')
				.prop('href', file.url);
				$(data.context.children()[index])
				.wrap(link);
			} else if (file.error) {
				var error = $('<span class="text-danger"/>').text(file.error);
				$(data.context.children()[index])
				.append('<br>')
				.append(error);
			}
		});
	}).on('fileuploadfail', function (e, data) {
		$.each(data.files, function (index) {
			var error = $('<span class="text-danger"/>').text('File upload failed.');
			$(data.context.children()[index])
			.append('<br>')
			.append(error);
		});
	}).prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');
};

$(document).ready(() => {
	initUploadDom();
});
