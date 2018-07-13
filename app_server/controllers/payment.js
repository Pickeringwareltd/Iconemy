var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

// Create payment here by calling update project with token/crowdsale payment details
// On successful payment - deploy contracts

// Display the pay screen
// Get ETH and BTC price here
// Calculate actual price here
// Take in voucher code here?
exports.index = function(req, res){

	var price_url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH';

	var amount;
	var error;
	var id = req.query.id;
	var item = req.query.item;
	var project = req.query.project;

	if(item == 'token'){
		amount = 499.99;
		item = {
			name: 'ERC-20 token',
			quantity: '1',
			price: 499.99
		};
	} else if(item == 'crowdsale'){
		amount = 1499.99;
		item = {
			id: id,
			name: 'ERC-20 Compliant Crowdsale',
			quantity: '1',
			price: 1499.99
		};
	} else {
		error = 'No item selected';
	}

	if(!project){
		error = 'No project selected';
	}

	requestOptions = {
		url : price_url,
		method : "GET",
		json : {}
	}; 

	request( requestOptions, function(err, response, body) {

		var eth = parseFloat(body.ETH);
		var btc = parseFloat(body.BTC);

		eth = eth * amount;
		btc = btc * amount;

		res.render('make_payment', { 
			title: 'Pay',
			project: project,
			payment: {
				dollars: amount,
				eth: eth,
				btc: btc,
				items: [item]
			}
		});
		
	});

};

exports.finalise = function(req, res) {
	// Double check the balance of the wallet provided (validation)
	// Finalise the payment and send to thank you screen
	// Thank you for purchasing, we are deploying your contract now, we will email you when its ready!
	var item = req.body.item;
	var project = req.body.project;
	var sale_id;

	if(!item || !project){
		error = 'Please specify an item, amount and a project.'
	}

	if(item.search('Crowdsale') > 0){
		sale_id = req.body.id;
		if(!sale_id){
			error = 'Please specify an ID for the crowdsale.'
		}
	}

	if(item.search('Crowdsale') < 0){
		// Token URL
		path = '/api/projects/' + project + '/token/payment/finalise';
	} else {
		// Crowdsale URL
		path = '/api/projects/' + project + '/crowdsales/' + sale_id + '/payment/finalise';
	}

	// Send any empty request, the api will then check the wallet and do the rest.
	requestOptions = {
		url : apiOptions.server + path,
		method : "PUT",
		json : {}
	}; 

	request( requestOptions, function(err, response, body) {

		if (response.statusCode === 200) {
			res.status(200).send({ message: "Worked" });
	    } else {
	    	console.log(body.message);
			res.status(400).send({ message: body.message });
		} 

	});

}

exports.create = function(req, res) {
	// We'd have to create the new wallet here.
	// Where should we store private key?

	var amount = req.query.amount;
	var currency = req.query.currency;
	var error;
	var item = req.query.item;
	var project = req.query.project;
	// Create wallet here
	var receiver_address = '0xc697F04Dcb807A0be4E1ffe78Fb5325bE112502d';
	var path;
	var sale_id;

	if(!item || !amount || !project){
		error = 'Please specify an item, amount and a project.'
	}

	if(item.search('Crowdsale') > 0){
		sale_id = req.query.id;

		if(!sale_id){
			error = 'Please specify an ID for the crowdsale.'
		}
	} else {
		sale_id = '';
	}

	if(!project){
		error = 'No project selected';
	}

	if(item.search('token') > 0){
		path = '/api/projects/' + project + '/token/payment';
	} else {
		path = '/api/projects/' + project + '/crowdsales/' + req.query.id + '/payment';
	}

	requestOptions = {
		url : apiOptions.server + path,
		method : "PUT",
		json : {
			currency: currency,
			amount: amount,
			createdBy: 'Jack',
			sentto: receiver_address
		}
	}; 

	request( requestOptions, function(err, response, body) {

		if (response.statusCode === 200) {
		    res.render('finalise_payment', { 
				title: 'Pay',
				payment: {
					amount: amount,
					currency: currency.toUpperCase(),
					address: receiver_address,
					item: item,
					id: sale_id,
					project: project
				},
				message: error
			});
	    } else {
	        res.render('error', { 
				message: body.message,
				error: {
					status: 404
				}
			});
		} 

	});
};
