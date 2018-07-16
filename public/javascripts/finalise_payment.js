var checkBTCBalance = function(address) {
	// Get balance of BTC wallet with atleast 6 confirmations
	var chainso_url = 'https://chain.so/api/v2/get_address_balance/BTC/' + address + '/6';

	// If the wallet is fully funded, call the finalise payment function on server 
	$.ajax({
	   url: chainso_url,
	   type: 'GET',
	   data: {},
	   success: function(response) {
			var btc = parseInt(response.data.confirmed_balance);

			finalisePayment(btc);
	   },
	   error: function(response){
		  	$('.error').html(response.data);
	    	$(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
		}
	});
};

var checkEthBalance = function(address) {
	var apiKey = '6KM91A9J1KW79X6F4QM7JMJAPFFG7V5YCP';
	var etherscan_url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;
	var testurl = 'http://api-rinkeby.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;

	// If the wallet is fully funded, call the finalise payment function on server 
	$.ajax({
	   url: testurl,
	   type: 'GET',
	   data: {},
	   success: function(response) {
			var wei = parseInt(response.result);
			var eth = parseFloat(wei / 1000000000000000000);

			finalisePayment(eth);
	   },
	   error: function(response){
		  	$('.error').html(response.responseJSON.message);
	    	$(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
		}
	});
};

var finalisePayment = function(balance){
	var project, item, id, url;
	var price = parseFloat($('#price').html().slice(0, -4));
	
	// Set balance element to new balance
	$('#balance').html(balance);

	// 0 should be taken out when we are confident it works with balance
	if(balance >= price){
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
		   		} 
		   },
		   error: function(response){
		   		$('#refresh_loader').delay(1000).css('display', 'none');
				$('#refresh_btn').delay(1000).css('display', 'block');
		   		$('.error').html(response.responseJSON.message);
	    		$(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
		   }
		});
	} else {
		$('#refresh_loader').delay(1000).css('display', 'none');
		$('#refresh_btn').delay(1000).css('display', 'block');
		$('.error').html('Balance not met. Current balance = ' + balance);
	    $(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
	}
}

// On refresh, call the check balance API to get balance and do something with it.
$('#refresh_btn').click(function() {
	$('#refresh_loader').css('display', 'block');
	$('#refresh_btn').css('display', 'none');
	var address = $('#eth_address').html();
	if($(this).attr('data-currency') == 'BTC'){
		var balance = checkBTCBalance(address);
	} else {
		var balance = checkEthBalance(address);
	}
});