// getElementById
function $id(id) {
	return document.getElementById(id);
}

$('#tokens').on("keyup",function(){
	var eth = $id('eth');
	var token_price_element = $id('token_price');

	var token_price = parseFloat(token_price_element.innerHTML);

	var eth_total = token_price * $('#tokens').val();

	$('#eth').val(eth_total);
});

$('#eth').on("keyup",function(){
	var eth = $id('eth');
	var token_price_element = $id('token_price');

	var token_price = parseFloat(token_price_element.innerHTML);

	var token_total = $('#eth').val() / token_price;

	token_total = token_total.toFixed(5);

	$('#tokens').val(token_total);
});

