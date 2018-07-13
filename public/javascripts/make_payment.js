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

$('#refresh_btn').click(function() {
	var project, item, id, url;

	item = $(this).attr('data-item');
	project = $(this).attr('data-project');

	if(item.search('Crowdsale') > 0){
		id = $(this).attr('data-id');
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
	   	console.log(response.message);
	   		if(response.message == 'Worked'){
	   			window.location.href="/projects/" + project;
	   		} else {
	   			$('.error').html(response.message);
    			$(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
	   		}
	   }
	});
});