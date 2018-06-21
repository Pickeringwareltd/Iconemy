$(document).ready(function(){

   $('#subdomain').readOnlySuffix('    .iconemy.io');

});

// getElementById
function $id(id) {
	return document.getElementById(id);
}

$('#submit_btn').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/project'
});

$('#description').on("click",function(){
	if($('#description').val() == 'Enter a basic description about your project here'){
		$('#description').val('');
	} 
});

$('#facebook_input').on("keyup",function(){
	var empty = $id('facebook_favicon_empty');
	var full = $id('facebook_favicon_full');

	if($('#facebook_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#twitter_input').on("keyup",function(){
	var empty = $id('twitter_favicon_empty');
	var full = $id('twitter_favicon_full');

	if($('#twitter_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#youtube_input').on("keyup",function(){
	var empty = $id('youtube_favicon_empty');
	var full = $id('youtube_favicon_full');

	if($('#youtube_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#bitcoin_input').on("keyup",function(){
	var empty = $id('bitcoin_favicon_empty');
	var full = $id('bitcoin_favicon_full');

	if($('#bitcoin_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#medium_input').on("keyup",function(){
	var empty = $id('medium_favicon_empty');
	var full = $id('medium_favicon_full');

	if($('#medium_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#telegram_input').on("keyup",function(){
	var empty = $id('telegram_favicon_empty');
	var full = $id('telegram_favicon_full');

	if($('#telegram_input').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#whitepaper').on("keyup",function(){
	var empty = $id('whitepaper_favicon_empty');
	var full = $id('whitepaper_favicon_full');

	if($('#whitepaper').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});

$('#onepager').on("keyup",function(){
	var empty = $id('onepager_favicon_empty');
	var full = $id('onepager_favicon_full');

	if($('#onepager').val() != ''){
		empty.style.display = 'none';
		full.style.display = 'block';
	} else {
		full.style.display = 'none';
		empty.style.display = 'block';
	}
});