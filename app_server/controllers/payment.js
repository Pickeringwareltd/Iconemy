var express = require('express');

exports.index = function(req, res){
	res.render('make_payment', { 
		title: 'Pay',
		payment: {
			dollars: 499.99,
			eth: 0.234,
			btc: 0.123,
			ethaddress: '0xc697F04Dcb807A0be4E1ffe78Fb5325bE112502d',
			btcaddress: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
			items: [{
				name: 'ERC-20 token',
				quantity: '1',
				price: 200.00
			},
			{
				name: 'Crowdsale',
				quantity: '1',
				price: 299.99
			}]
		}
	});
};
