domEventBind('click', '#request', (e) => {

	var articleObj = {
		title: 'asda',
		content: 'qweqwe'
	};
	postArticle(articleObj, (err, data) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(data);
	});
	
});
