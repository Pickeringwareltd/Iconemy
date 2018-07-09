var usd_eth;
var fetched;

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

$(function() {
	$('input[name="sale_duration"]').daterangepicker({
		opens: 'left',
		minDate: moment(),
		startDate: moment(),
		endDate: moment().add(1, 'month'),
		locale: {
        	"format": "DD/MM/YYYY"
        }
	}, function(start, end, label) {
		console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
	});

	$('#start_time').timepicker({ 'step': 15 });
	$('#end_time').timepicker({ 'step': 15 });

	fetchPrices();

	// With JQuery
	$("#commission_selector").slider({
	    ticks: [1, 2, 3, 4, 5],
	    ticks_labels: ['1%', '2%', '3%', '4%', '5%'],
	    ticks_snap_bounds: 30,
	    value: 3
	});

});

$('#sale_type').on("change",function(){
	// Re-direct to new project form
	if($('#sale_type').val() == 'public-sale') {
		$('#min_message').html('This means you <b>CANNOT create more crowdsales</b> with this token in the future.');
	} else {
		$('#min_message').html('This means you can <b>create more crowdsales</b> with this token in the future.');
	}
});

$("#commission_selector").on("change",function(){
	switch($("#commission_selector").val()) {
	    case '1':
	    	$("#commision_cost_value").html('<b>$1999.99</b>');
	        break;
	    case '2':
	    	$("#commision_cost_value").html('<b>$1499.99</b>');
	        break;
	    case '3':
	    	$("#commision_cost_value").html('<b>$999.99</b>');
	    	break;
	    case '4':
	    	$("#commision_cost_value").html('<b>$499.99</b>');
	    	break;
	    case '5':
	    	$("#commision_cost_value").html('<b>FREE</b>');
	    	break;
	    default:
	    	$("#commision_cost_value").html('<b>$1999.99</b>');
	}
});

$('#token_price').on("keyup",function(){
	var dollar_price;
	var tokens_in_eth;
	var tokens_in_dollar;

	var token_price;

	if($('#token_price').val() == '') {
		token_price = 0;
	} else {
		token_price = parseFloat($('#token_price').val());
	}

	if(fetched){
		dollar_price = usd_eth * token_price;
		dollar_price = dollar_price.toFixed(2);

		tokens_in_dollar = 1 / usd_eth;
		tokens_in_dollar = tokens_in_dollar / token_price;
		tokens_in_dollar = tokens_in_dollar.toFixed(5);

		tokens_in_eth = 1 / token_price;
		tokens_in_eth = tokens_in_eth.toFixed(5);
	}

	$('#dollar_price').html('1 DON = <b>$' + dollar_price + '</b>');
	$('#tokens_in_dollar').html('$1 = <b>' + tokens_in_dollar + ' DON</b>');
	$('#tokens_in_eth').html('1 ETH = <b>' + tokens_in_eth + ' DON</b>');


});

function fetchPrices(){
  var url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
  var obj;

  fetch(url).then(function(response) {
    return response.json();
  }).then(function(data) {
    usd_eth = parseFloat(data.USD);
    fetched = true;
  }).catch(function() {
  	fetched = false;
    return "error";
  });
}