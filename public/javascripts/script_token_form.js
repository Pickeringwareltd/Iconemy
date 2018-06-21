$("#login_btn").click(function() {
	window.location.href = "/projects";
	return false;
});

$("#submit_btn").click(function() {
	window.location.href = "/pay";
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