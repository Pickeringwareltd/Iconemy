'use strict';

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