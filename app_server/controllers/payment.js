'use strict';

var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
}

// Create payment here by calling update project with token/crowdsale payment details
// On successful payment - deploy contracts

// Display the pay screen
// Get ETH and BTC price here
// Calculate actual price here
exports.create = function(req, res){
	try{

		var path, amount, sale_id, error, requestOptions, access_token;

		var id = req.query.id;
		var item = req.query.item;
		var project = req.query.project;
		
		if(!item || !project){
			error = 'Please specify an item and a project.'
		}

		if(item === 'crowdsale'){
			sale_id = req.body.id;
			if(!sale_id){
				error = 'Please specify an ID for the crowdsale.'
			}
			
			path = '/api/projects/' + project + '/crowdsales/' + id + '/payment';
		}

		if(item === 'token'){
			// Token URL
			path = '/api/projects/' + project + '/token/payment';
		} 

		access_token = req.session.passport.user.tokens.access_token;

		requestOptions = {
			url : apiOptions.server + path,
			method : "POST",
			json : {
				projectid: project,
				item: item,
				crowdsaleid: id
			},
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		}; 

		request( requestOptions, function(err, response, body) {

			var eth = body.eth;
			var btc = body.btc;
			var amount = body.dollars;
			var item = body.item;
			var discount = body.discount;

			if(item === 'token'){
				item = {
					name: 'ERC-20 Compliant Token',
					quantity: '1',
					price: amount
				}
			} else {
				item = {
					name: 'ERC-20 Compliant Crowdsale',
					quantity: '1',
					price: amount,
					id: id
				}
			}

			if(amount != 0){

				res.render('make_payment', { 
					title: 'Pay',
					project: project,
					payment: {
						dollars: amount,
						eth: eth,
						btc: btc,
						items: [item],
						discount: discount
					}
				});
			} else {
				// This is where we would deploy the contracts
				res.redirect('/projects/' + project);			
			}
			
		});
	} catch(e) {
		console.log('Error on server-side controllers payment.js/create: ' + e);
	}
};

exports.confirm = function(req, res) {
	try{
	
		var requestOptions, path, sale_id, error, access_token;

		var amount = req.query.amount;
		var currency = req.query.currency;
		var item = req.query.item;
		var project = req.query.project;

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

		if(item.search('Crowdsale') > 0){
			path = '/api/projects/' + project + '/crowdsales/' + req.query.id + '/payment/confirm';		
		} else {
			path = '/api/projects/' + project + '/token/payment/confirm';
		}

		access_token = req.session.passport.user.tokens.access_token;

		requestOptions = {
			url : apiOptions.server + path,
			method : "PUT",
			json : {
				currency: currency,
				amount: amount,
				createdBy: req.session.passport.user.user.id
			},
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		};

		request( requestOptions, function(err, response, body) {

			var address;

			if(currency === 'eth'){
				address = body.ethWallet.address;
			} else {
				address = body.btcWallet.address;
			}

			if (response.statusCode === 200) {
				res.render('finalise_payment', { 
					title: 'Pay',
					payment: {
						amount: amount,
						currency: currency.toUpperCase(),
						item: item,
						id: sale_id,
						project: project,
						address: address
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
	} catch(e) {
		console.log('Error on server-side controllers payment.js/confirm: ' + e);
	}
};

exports.finalise = function(req, res) {
	try{
		// Double check the balance of the wallet provided (validation)
		// Finalise the payment and send to thank you screen
		// Thank you for purchasing, we are deploying your contract now, we will email you when its ready!
		var sale_id, error, requestOptions, path, access_token;

		var item = req.body.item;
		var project = req.body.project;

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

		access_token = req.session.passport.user.tokens.access_token;

		// Send any empty request, the api will then check the wallet and do the rest.
		requestOptions = {
			url : apiOptions.server + path,
			method : "PUT",
			json : {},
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		}; 

		request( requestOptions, function(err, response, body) {

			if (response.statusCode === 200) {
				res.status(200).send({ message: "Worked" });
		    } else {
				res.status(400).send({ message: body.message });
			} 

		});
	} catch(e) {
		console.log('Error on server-side controllers payment.js/finalise: ' + e);
	}
};
