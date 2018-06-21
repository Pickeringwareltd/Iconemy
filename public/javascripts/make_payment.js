$("#eth_copy_button").click(function() {
	window.location.href = "/project";
	return false;
});

$("#eth_btn").click(function() {
	$("#payment_channels").css('display', 'none');
	$("#payment_address").css('display', 'block');
});

$("#btc_btn").click(function() {
	$("#payment_channels").css('display', 'none');
	$("#btc_payment_address").css('display', 'block');
});

$("#btc_copy_button").click(function() {
	window.location.href = "/project";
	return false;
});

$("#card_btn").click(function() {
	window.location.href = "/project";
	return false;
});