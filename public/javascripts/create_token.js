'use strict';

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

// Restrict file size to 1MB
widget.validators.push(function(fileInfo) {
  if (fileInfo.size !== null && fileInfo.size > 1024 * 1024) {
    throw new Error("maxFileSize");
  }
});

$("#login_btn").click(function() {
	window.location.href = "/projects";
	return false;
});

$("#token_symbol").keyup(function() {
	var symbol = $("#token_symbol").val();
	$("#min_sym").html('  ' + symbol);
});

$("#token_decimals").keyup(function() {

  var answer = calculateMinimum($("#token_decimals").val());
  $("#min_dec").html(' ' + answer);

});

$("#token_decimals").change(function() {
  var answer = calculateMinimum($("#token_decimals").val());
  $("#min_dec").html(' ' + answer);
});

function calculateMinimum(decimals) {
	
	var decimals = $("#token_decimals").val();
  	var answer = 1 / 10 ** decimals;

  	return answer;
}