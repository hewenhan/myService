$(document).ready(() => {
	if (getQueryStringByName('tipLogin') == 'true' && !pageData.userInfo.id) {
		$('#tipMsg').html('您无权访问页面，请先登录');
	}
});
