$('.buynow_section').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/sale'
});

$('#new_token').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/token/create';
});

$('.token_link').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	
	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/token'
});

$('#new_crowdsale').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/crowdsales/create';
});

$('.crowdsale').on("click",function(){
	var index = $(this).attr('data-index');
	var subdomain = $(this).attr('data-subdomain');

	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/crowdsales/' + index;
});

$('#submit_btn').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/pay'
});