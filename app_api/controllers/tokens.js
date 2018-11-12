'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Discount = mongoose.model('Discount');
var WAValidator = require('wallet-address-validator');
var paymentJS = require('./payment_util');
var request = require('request');
var tracking = require('../../add-ons/tracking');
var errors = require('../../add-ons/errors');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.tokenCreate = function (req, res) { 
	try{
		// To add a token, you must first find the parent document (project), add the subdocument (crowdsale) to it and restore.
		var projectID = req.params.projectid;

		if(!projectID){
			sendJsonResponse(res, 404, {"message": "Not found, ProjectID required"});
			return;
		} else {
			// Find the project and pass the object to the addToken function (below)
			Project
				.find({subdomain: projectID})
				.select('token')
				.exec(function(err, _project) {
					var project = _project[0];

					if(!project){
						sendJsonResponse(res, 404, {"message": "Project not found"});
						return;
					}
					if(err){
						errors.print(err, 'Error getting project to create token: ');
						sendJsonResponse(res, 404, 'Error getting project to create token');
						return;
					} else {
						if(project.token){
							sendJsonResponse(res, 404, {"message": "You can only create one token per project"});
						} else {
							addToken(req, res, project);
						}
					}
				});
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/tokenCreate: ');
	}
};

var addToken = function(req, res, project) {
	try{
	  	if (!project) {
	    	sendJsonResponse(res, 404, { "message": "Project ID not found" });
		} else {
			var newToken = getToken(req);

			if(!validateToken(newToken)){
	        	sendJsonResponse(res, 404, {"message": "Oops! Looks like your token data is invalid!"});
	        	return;
			}

			// Add the new token to the parent document (project)
	    	project.token = newToken;

	    	// Save the new parent document(project)
	    	project.save(function(err, project) {
	      		
	      		if (err) {
	      			errors.print(err, 'Error creating token: ');
	        		sendJsonResponse(res, 400, 'Error creating token');
	     	 	} else {
	     	 		tracking.newtoken(project.token);
	     	 		// Return newly created token
					sendJsonResponse(res, 201, project.token);
	    		} 

	    	});
		} 
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/addToken: ');
	}
};

var validateToken = function(token){
	try{
		var passedTests = true;

		if(!token.name || !token.symbol || !token.decimals || !token.owner){
			passedTests = false;
		}

		if(token.symbol.length < 3 || token.symbol.length > 4){
			passedTests = false;
		}

		if(token.decimals < 0 || token.decimals > 18){
			passedTests = false;
		}

		if(!WAValidator.validate(token.owner, 'ETH')){
			passedTests = false;
		}

		return passedTests;
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/validateToken: ');
	}
}

// Creates crowdsale object from form data ready to be added to a project
var getToken = function(req) {
	try{
		var token = {
			name: req.body.name,
			symbol: req.body.symbol,
			decimals: req.body.decimals,
			owner: req.body.owner,
			logo: req.body.logo,
			created: Date.now(),
			createdBy: req.body.createdBy,
			discount_code: req.body.discount,
			deployed: 'None'
		}

		return token;
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/getToken: ');
	}
};

module.exports.tokenRead = function (req, res) { 
	try{
		// If the request parameters contains a project ID, then execute a query finding the object containing that id
		if (req.params && req.params.projectid) {
			// Call the Project model function to find the ID passed as a request parameter in the URL
			// I.e. api/projects/123
			// Execute the query and return a JSON response including the project found or an error
			Project
		    	.find({subdomain: req.params.projectid})
		    	.select('name social token')
		    	.exec(function(err, _project) {
		    		var project = _project[0];

		    		// If no project is found, return custom error message
		      		if (!project) {
		          		sendJsonResponse(res, 404, { "message": "projectID not found" });
		          		return;
		          		// If an error was returned, return that message
		          	} else if (err) {
		          		errors.print(err, 'Error getting project to get token: ');
		          		sendJsonResponse(res, 404, 'Error getting project to get token');
		          		return;
		      		} else {
		      			var token = project.token;

			      		if(!token){
			      			sendJsonResponse(res, 404, { "message": "Token does not exist" });
			          		return;
			      		} else {

			      			var token_address = null;

			      			if(token.contract != null){
			      				token_address = token.contract.address;
			      			}

			      			var response = {
			      				project: {
			      					name: project.name,
			      					id: req.params.projectid
			      				},
			      				token: {
			      					name: token.name,
			      					symbol: token.symbol,
			      					decimals: token.decimals,
			      					logo: token.logo,
			      					social: project.social,
			      					deployed: token.deployed,
			      					jsFileURL: token.jsFileURL,
			      					address: token_address
			      				}
			      			}
			      			sendJsonResponse(res, 200, response);
			      		}
			      	}
		    	});
		   } else {
		   		// Else if no projectID was specified in the request, return custom error message
		   		sendJsonResponse(res, 404, { "message": "No projectID in request" });
		   }
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/tokenRead: ');
	}
};

// As we are dealing with smart contracts, we cannot allow users to update and/or delete tokens as the smart contract will remain on the network
module.exports.tokenUpdate = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot update a token, the smart contract has now been released and will not be able to change."});
};

/* This function should firstly take in: projectid, item, crowdsaleid (optional) and discount code (optional)
 * It then loads the appropriate item (if crowdsale, loads the commission selected) 
 * It then looks up the discount code supplied against the list of discount codes in the DB
 * It then applies the discount to the item for the code and/or commission selected and stores in the DB
 * It then returns an object containing the price of the item in USD/ETH/BTC and the discount that has been applied
 */
module.exports.getPrice = function (req, res) {
    try{
        // If the request parameters contains a project ID, then execute a query finding the object containing that id
		if (req.body && req.body.projectid && req.body.item) {

			if(req.body.item === 'token'){

				var item_price, total_price, discount, requestOptions;
				var project = req.body.projectid;

				// Call the pricing URL to get accurate information on USD -> BTC/ETH prices
				var price_url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH';

				requestOptions = {
					url : price_url,
					method : "GET",
					json : {}
				}; 

				request( requestOptions, function(err, response, body) {

					if(err){
						errors.print(err, 'Error getting pricing information: ');
		  				sendJsonResponse(res, 404, 'Error getting pricing information');
		  				return;
					}

					// Set the crypto prices ready for conversion
					var eth = parseFloat(body.ETH);
					var btc = parseFloat(body.BTC);

					// Find the project and pass the object to the addCrowdsale function (below)
					Project
						.find({subdomain: project})
						.select('token')
						.exec(function(err, _project) {
							var project = _project[0];

							if(err){
								errors.print(err, 'Error getting project to get token: ');
								sendJsonResponse(res, 404, 'Error getting project to get token');
								return;
							}

							item_price = 499.99;
							// Declare again so that nested Discount function can use it
							var price = item_price;
							discount = project.token.discount_code;

							// Find the discount code and apply to price if necessary
							Discount
								.find({name: discount})
								.exec(function(err, _discount) {

									var discount = _discount[0];

									if(err){
										errors.print(err, 'Error getting dicounts: ');
										sendJsonResponse(res, 404, 'Error getting dicounts');
										return;
									}

									if(discount){
										if(discount.type === 'percent'){
											// Work out the new item price given the discount.
											var discount_amount = parseInt(discount.amount);	

											if(discount_amount !== 100){
												var take_off = 100 - discount_amount;
												take_off = take_off / 100;
												price = price * take_off;
												price = price.toFixed(2);										
											} else {
												price = 0;
											}
										} else {
											var discount_amount = discount.amount;
											price = price - discount_amount;
										}
									}

									// If price is 0 (free) then mark the product as paid for so we can deploy.
									if(price === 0){
										markAsPaid(req, res, project);
									} else {									

										// Convert USD item price to ETH and BTC
										eth = eth * price;
										btc = btc * price;

										var pricing = {
												dollars: price,
												eth: eth,
												btc: btc,
												item: req.body.item,
												discount: discount
											};
					  					
					  					sendJsonResponse(res, 200, pricing);
					  				}

								});

						});
		
				});

			} else {
				// Else if no crowdsaleID was specified in the request, return custom error message
		  		sendJsonResponse(res, 404, { "message": "Not found, token required" });
			}

		} else {
			// Else if no projectID was specified in the request, return custom error message
		  	sendJsonResponse(res, 404, { "message": "Not found, project ID and/or item name is required" });
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/getPrice: ');
	}
};

// This function is used to mark items as paid IF the discount code allows the item to be purchased for free
var markAsPaid = function (req, res, project) {
		var token = project.token;

		// Create a payment object if one doesnt already exist
		if(!token.payment){
			token.payment = {
				currency: '',
				paid: '',
				amount: 0,
				sentTo: '',
				created: '',
				createdBy: ''
			};
		}

		var payment = token.payment;

		// Set the payment date and store in DB as PAID
		payment.currency = 'none';
		payment.amount = 0;
		payment.created = Date.now();
		payment.createdBy = 'Contract creator';
		payment.paid = Date.now();
		project.token.deployed = "Deploying";

		project.save(function(err, project) {
			if (err) {
				errors.print(err, 'Error marking item as free');
				sendJsonResponse(res, 404, 'Error creating project with price = 0');
			} else {
				tracking.paymentfinalised(payment, 'crowdsale');
				sendJsonResponse(res, 201, payment);
			} 
		});
};

// Confirming payments is necessary to store payments for later use, i.e. users may create a token and then pay a week later, confirming the payment optin allows us to create a wallet for deposit
module.exports.paymentConfirm = function (req, res) { 
	try{
		var project = req.params.projectid;

		if(!project){
			sendJsonResponse(res, 404, {"message": "Not found, ProjectID required"});
			return;
		} else {
			// Find the project and pass the object to the addToken function (below)
			Project
				.find({subdomain: req.params.projectid})
				.select('token')
				.exec(function(err, _project) {
					var project = _project[0];
						
					if(err){
						errors.print(err, 'Error getting projects to confirm token payment: ');
						sendJsonResponse(res, 404, 'Error getting projects to confirm token payment');
						return;
					} else if (!project){
						sendJsonResponse(res, 404, {"message": "Project not found"});
					} else {
						if(project.token){
							var createdDate;

							if(project.token.payment === undefined){
								project.token.payment = {};
								createdDate = Date.now();
							} else {
								createdDate = project.token.created;
							}

							var payment = project.token.payment;
								
							// Create wallet which either creates a new wallet and encrypts private key
							// Or loads existing keys from the DB if already used.
							var wallet;
							if(req.body.currency === 'eth' && !payment.ethWallet){
								// Create new wallet for taking payments
								wallet = paymentJS.createWallet('eth');
							} else if(req.body.currency === 'btc' && !payment.btcWallet){
								// Create new wallet for taking payments
								wallet = paymentJS.createWallet('btc');
							} else {
								if(req.body.currency === 'eth'){
									wallet = {
										address: payment.ethWallet.address,
										seed: payment.ethWallet.seed
									};
								} else {
									wallet = {
										address: payment.btcWallet.address,
										seed: payment.btcWallet.seed
									};
								}
							}

							if(req.body.currency === 'eth' && !WAValidator.validate(wallet.address, 'ETH')){
								sendJsonResponse(res, 404, {"message": "Must be a valid ETH address!"});
								return;
							} else if(req.body.currency === 'btc' && !WAValidator.validate(wallet.address, 'BTC')){
								sendJsonResponse(res, 404, {"message": "Must be a valid BTC address!"});
								return;
							}

							payment.currency = req.body.currency;
							payment.amount = req.body.amount;
							payment.created = createdDate;
							payment.createdBy = req.body.createdBy;
							if(req.body.currency === 'eth'){
								payment.ethWallet = wallet;
							} else {
								payment.btcWallet = wallet;
							}

							project.save(function(err, project) {
							    if (err) {
							    	errors.print(err, 'Error saving project with new token: ');
							        sendJsonResponse(res, 404, {"message": 'Error saving project with new token'});
							    } else {
							    	tracking.paymentconfirmed(payment, 'token');
							        sendJsonResponse(res, 200, payment);
								} 
							});

						} else {
							sendJsonResponse(res, 404, {"message": "Token not found"});
						}
					}
				});
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/paymentConfirm: ');
	}
};

// Function is used as callback to deal with the deposit wallet balance
// If the wallet balance is above the requested deposit amount, store item as 'paid'
// Else, return error.
var dealWithBalance = function(project, balance, res) {
	try{
		var payment = project.token.payment;

		if(balance >= payment.amount){

			payment.paid = Date.now();
			project.token.deployed = "Deploying";

			project.save(function(err, project) {
				if (err) {
					errors.print(err, 'Error saving project with balance: ');
					sendJsonResponse(res, 404, {"message": 'Error saving project with balance'});
				} else {
					tracking.paymentfinalised(payment, 'token');
					sendJsonResponse(res, 200, payment);
				} 
			});
										
		} else {
			sendJsonResponse(res, 404, {"message": "Deposit amount not met"});
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/dealWithBalance: ');
	}
};

// Finalise payment by checking if wallet is funded and setting contract to paid, this will then trigger the deployment
module.exports.paymentFinalise = function (req, res) { 
	try{
		var project = req.params.projectid;
		// Check wallet balance, if not equal to amount entered then return error
		if(!project){
			sendJsonResponse(res, 404, {"message": "Not found, ProjectID required"});
			return;
		} else {
			// Find the project and pass the object to the addToken function (below)
			Project
				.find({subdomain: req.params.projectid})
				.select('token')
				.exec(function(err, _project) {
					var project = _project[0];
						
					if(err){
						errors.print(err, 'Error finding project to finalise payment: ');
						sendJsonResponse(res, 404, 'Error finding project to finalise payment');
						return;
					} else if (!project){
						sendJsonResponse(res, 404, {"message": "Project not found"});
					} else {
						if(project.token){
							var createdDate;
							var payment = project.token.payment;

							if(payment){

								if(!payment.paid){
									var wallet_address;

									if(payment.currency === 'eth'){
										wallet_address = payment.ethWallet.address;
									} else {
										wallet_address = payment.btcWallet.address;
									}

									// Call getBalance function with callback ensuring the balance is dealt with only when it is returned.
									// Use 'null' for crowdsale ID so that the payment function knows not to include it in callback.
									var balance = paymentJS.getBalance(wallet_address, project, null, res, dealWithBalance);

								} else {
									sendJsonResponse(res, 404, {"message": "Already paid for!"});
								}
							} else {
								sendJsonResponse(res, 404, {"message": "You must create a payment first!"});
							}

						} else {
							sendJsonResponse(res, 404, {"message": "Token not found"});
						}
					}
				});
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers tokens.js/paymentFinalise: ');
	}
};

module.exports.tokenDelete = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a token, the smart contract has now been released and will not be able to change."});
};