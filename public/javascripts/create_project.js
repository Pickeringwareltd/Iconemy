$(document).ready(function(){
   $('#subdomain').readOnlySuffix('    .iconemy.io');
});

// getElementById
function $id(id) {
	return document.getElementById(id);
}

// Getting an instance of the widget.
const widget = uploadcare.Widget('[role=uploadcare-uploader]');
// Selecting an image to be replaced with the uploaded one.
const preview = document.getElementById('uploaded_logo');
// "onUploadComplete" lets you get file info once it has been uploaded.
// "cdnUrl" holds a URL of the uploaded file: to replace a preview with.
// Display preview of image in the image box after uploading
widget.onUploadComplete(fileInfo => {
	$('#upload_section').css('display', 'none');
	$('#uploaded_logo').css('display', 'block');
 	preview.src = fileInfo.cdnUrl;
});

// Restrict image size to less than 1MB
widget.validators.push(function(fileInfo) {
  if (fileInfo.size !== null && fileInfo.size > 1024 * 1024) {
    throw new Error("fileMaximumSize");
  }
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