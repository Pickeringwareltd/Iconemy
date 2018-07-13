$("#eth_btn").click(function() {
	var project, item, id, currency, amount;

	item = $(this).attr('data-item');
	currency = 'eth';
	amount = $(this).attr('data-amount');
	project = $(this).attr('data-project');

	if(item.search('Crowdsale') > 0){
		id = $(this).attr('data-id');
		window.location.href = "/pay/finalise?project=" + project + "&item=" + item + "&id=" + id + "&currency=" + currency + "&amount=" + amount;
	} else {
		window.location.href = "/pay/finalise?project=" + project + "&item=" + item + "&currency=" + currency + "&amount=" + amount;
	}
});

$("#btc_btn").click(function() {
	var project, item, id, currency, amount;

	item = $(this).attr('data-item');
	currency = 'btc';
	amount = $(this).attr('data-amount');
	project = $(this).attr('data-project');

	if(item.search('Crowdsale') > 0){
		id = $(this).attr('data-id');
		window.location.href = "/pay/finalise?project=" + project + "&item=" + item + "&id=" + id + "&currency=" + currency + "&amount=" + amount;
	} else {
		window.location.href = "/pay/finalise?project=" + project + "&item=" + item + "&currency=" + currency + "&amount=" + amount;
	}
});

$("#card_btn").click(function() {
	window.location.href = "/project";
	return false;
});

var checkEthBalance = function(address) {
	var apiKey = '6KM91A9J1KW79X6F4QM7JMJAPFFG7V5YCP';
	var etherscan_url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;

	// If the wallet is fully funded, call the finalise payment function on server 
	$.ajax({
	   url: etherscan_url,
	   type: 'GET',
	   data: {},
	   success: function(response) {
			var wei = parseInt(response.result);
			var eth = parseFloat(wei / 1000000000000000000);

			finalisePayment(eth);
	   }
	});
};

var finalisePayment = function(balance){
	var project, item, id, url;
	var price = parseFloat($('#price').html().slice(0, -4));

	if(balance >= price || balance == 0){
		console.log('payment success!');

		item = $('#refresh_btn').attr('data-item');
		project = $('#refresh_btn').attr('data-project');

		if(item.search('Crowdsale') > 0){
			id = $('#refresh_btn').attr('data-id');
			url = "/pay/finalise";
		} else {
			id = '';
			url = "/pay/finalise";
		}

		// If the wallet is fully funded, call the finalise payment function on server 

		// THIS IS NO LONGER WORKING -- BAD REQUEST?
		$.ajax({
		   url: url,
		   type: 'PUT',
		   data: {
		   	item: item,
		   	project: project,
		   	id: id
		   },
		   success: function(response) {
		   		if(response.message == 'Worked'){
		   			window.location.href="/projects/" + project;
		   		} else {
		   			$('.error').html(response.message);
	    			$(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
		   		}
		   }
		});
	} else {
		$('#balance').html(balance);
	}
}

$('#refresh_btn').click(function() {
	var address = $('#eth_address').html();
	var balance = checkEthBalance(address);
});