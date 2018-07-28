domEventBind('click', '#request', (e) => {
	requestApi('postArticle', {
		title: 'asd',
		content: 'qwe'
	}, (err, data) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(data);
	});
});
