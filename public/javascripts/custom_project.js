$('.buynow_section').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');

	console.log('https://' + subdomain + '.iconemy.io/buynow');
	
	// Re-direct to new project form
	window.location.href = 'https://' + subdomain + '.iconemy.io/buynow';
});

$('#new_token').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/token/create';
});

$('.token_link').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	var using_sub = $(this).attr('data-usingSubdomain');

	// Only redirect to /token if they are using a subdomain
	if(using_sub == 'true'){
		window.location.href = '/token';
	} else {
		window.location.href = '/projects/' + subdomain + '/token';
	}

});

$('#new_crowdsale').on("click",function(){
	var subdomain = $(this).attr('data-subdomain');
	// Re-direct to new project form
	window.location.href = '/projects/' + subdomain + '/crowdsales/create';
});

$('.crowdsale').on("click",function(){
	var index = $(this).attr('data-index');
	var subdomain = $(this).attr('data-subdomain');

	var using_sub = $(this).attr('data-usingSubdomain');

	// Only redirect to /crowdsales/ID if they are using a subdomain
	if(using_sub == 'true'){
		window.location.href = '/crowdsales/' + index;
	} else {
		window.location.href = '/projects/' + subdomain + '/crowdsales/' + index;
	}
});

$('#submit_btn').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/pay'
});