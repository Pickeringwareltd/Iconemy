$('table tr').on("click",function(){
	var subdomain = $(this).attr('data-project');
	var path = '/admin/projects/' + subdomain;

	window.location.replace(path);
});