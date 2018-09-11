'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Discount = mongoose.model('Discount');
var WAValidator = require('wallet-address-validator');
var validator = require('validator');
var paymentJS = require('./payment_util');
var request = require('request');
var tracking = require('../../tracking/tracking');
const sgMail = require('@sendgrid/mail');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var sendEmail = function(email){
	// using SendGrid's v3 Node.js Library
	// https://github.com/sendgrid/sendgrid-nodejs
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
	  to: email,
	  from: 'jp@iconemy.io',
	  subject: 'Hello world',
	  text: 'Hello plain world!',
	  html: '<p>Hello HTML world!</p>',
	  templateId: 'd-0fa622099d954e6fb33d49011048a04e'
	};

	sgMail.send(msg);
};

/* This function is used by the web3 crowdsale function to record successful transactions made through the site
 * All that we will store is the email against the transaction hash, we can then work everything else out via the logs
 * I.e. we can match the tx hash to the logs, get the users eth address and use that eth address to work out other purchases on the same account
 * We can loop through the successful 'TokenPurchase' events, checking the txHash against the list of emails, if one is there add the email to that TX, if not, no email was supplied.
*/
module.exports.recordPurchaseEmail = function(req, res){

	var json = JSON.parse(req.body.json);

	var purchaseObj = {
		email: json.email,
		hash: json.hash.tx,
		time: Date.now()
	}

	if(!validator.isEmail(purchaseObj.email)){
		sendJsonResponse(res, 400, {"message": "Email must be valid"});
		return;						
	}

	var projectid = req.params.projectid;
	var crowdsaleid = req.params.crowdsaleid;

	// If transaction was deemed successful
	if(json.hash.receipt.status == '0x1'){

		// Find the project and pass the object to the addEmails function (below)
		Project
			.find({subdomain: projectid})
			.select('crowdsales')
			.exec(function(err, _project) {
				var project = _project[0];

				if(err){
					sendJsonResponse(res, 400, err);
					return;
				} else {

					if(project.crowdsales && project.crowdsales.length > 0){
						var thisSale = project.crowdsales[crowdsaleid];
						if(!thisSale){
							sendJsonResponse(res, 400, {"message": "Crowdsale does not exist"});
							return;
						}
					} else {
						sendJsonResponse(res, 400, {"message": "This project has no crowdsales"});
						return;
					}

					addEmail(req, res, project, crowdsaleid, purchaseObj);
				}
			});
	}
}

var addEmail = function(req, res, project, sale, purchaseObj) {
  	if (!project || !sale) {
    	sendJsonResponse(res, 400, { "message": "You must supply both project and crowdsale ID" });
    	return;
	} else {
		// Push the new purchase object into the crowdsales emails array
    	project.crowdsales[sale].emails.push(purchaseObj);

    	// Save the new parent document(project)
    	project.save(function(err, project) {
      
      		if (err) {
        		sendJsonResponse(res, 400, err);
        		console.log(err);
     	 	} else {
     	 		sendEmail(purchaseObj.email);
     	 		// tracking.newemail(purchaseObj);
     	 		// only return the recently added crowdsale (which is the last one in the array)
				sendJsonResponse(res, 201, purchaseObj);
    		} 
    	});
	} 
};

module.exports.crowdsalesCreate = function (req, res) { 

	// To add a crowdsale, you must first find the parent document (project), add the subdocument (crowdsale) to it and restore.
	var project = req.params.projectid;

	if(!project){
		sendJsonResponse(res, 404, {"message": "Not found, ProjectID required"});
		return;
	} else {
		// Find the project and pass the object to the addCrowdsale function (below)
		Project
			.find({subdomain: project})
			.select('token crowdsales')
			.exec(function(err, _project) {
				var project = _project[0];

				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					var token = project.token;

					if(project.crowdsales && project.crowdsales.length > 0){
						var lastSale = project.crowdsales[project.crowdsales.length - 1];

						if(lastSale.end > new Date(req.body.start)){
							sendJsonResponse(res, 404, {"message": "Your sale must start after the previous sale has finished."});
							return;						
						}
					}

					if(!WAValidator.validate(req.body.admin, 'ETH') || !WAValidator.validate(req.body.beneficiary, 'ETH')){
						sendJsonResponse(res, 404, {"message": "You must provide a valid ETH address."});
						return;	
					}

					if(new Date(req.body.end) < new Date(req.body.start)){
						sendJsonResponse(res, 404, {"message": "Your sale must end after it has started."});
						return;	
					}

					// Check for a project token, otherwise there is nothing to sell
					if(!token){
						sendJsonResponse(res, 404, {"message": "You cannot create a crowdsale without a token"});
						return;
					} else {
						addCrowdsale(req, res, project);
					}
				}
			});
	}
};

var addCrowdsale = function(req, res, project) {
  	if (!project) {
    	sendJsonResponse(res, 404, { "message": "Project ID not found" });
	} else {
		var length = project.crowdsales.length;
		var crowdsale = getCrowdsale(req);
		crowdsale.index = length;

		// Push the new crowdsale object into the projects crowdsale array
    	project.crowdsales.push(crowdsale);

    	// Save the new parent document(project)
    	project.save(function(err, project) {
      
      		if (err) {
        		sendJsonResponse(res, 400, err);
     	 	} else {
     	 		tracking.newcrowdsale(crowdsale);
     	 		// only return the recently added crowdsale (which is the last one in the array)
				sendJsonResponse(res, 201, crowdsale);
    		} 

    	});
	} 
};

// Creates crowdsale object from form data ready to be added to a project
var getCrowdsale = function(req) {
	var crowdsale = {
		name: req.body.name,
		status: 'Not started',
		start: req.body.start,
		end: req.body.end,
		pricingMechanism: req.body.pricingmechanism,
		initialPrice: parseFloat(req.body.initialprice),
		public: req.body.public,
		commission: parseInt(req.body.commission),
		admin: req.body.admin,
		beneficiary: req.body.beneficiary,
		created: Date.now(),
		createdBy: req.body.createdBy,
		discount_code: req.body.discount,
		deployed: 'None'
	}

	if(parseInt(req.body.commission) == 5){
		crowdsale.deployed = 'Deploying';
	}

	return crowdsale;
};

// Find one crowdsale under a specific project
module.exports.crowdsalesReadOne = function (req, res) { 
	// If the request parameters contains a project ID, then execute a query finding the object containing that id
	if (req.params && req.params.projectid && req.params.crowdsaleid) {
		// Call the Project model function to find the ID passed as a request parameter in the URL
		// I.e. api/projects/123
		// Execute the query and return a JSON response including the project found or an error
		Project
	    	.find({subdomain: req.params.projectid})
	    	.select('name social token crowdsales')
	    	.exec(function(err, _project) {
	    		var project = _project[0];
	    		// If no project is found, return custom error message
	      		if (!project) {
	          		sendJsonResponse(res, 404, { "message": "projectID not found" });
	          		return;
	          		// If an error was returned, return that message
	          	} else if (err) {
	          		sendJsonResponse(res, 404, err);
	          		return;
	      		} else {

		      		if(project.crowdsales && project.crowdsales.length > 0){
		      			var crowdsale = project.crowdsales[req.params.crowdsaleid];

		      			if(!crowdsale || crowdsale.length == 0){
		   					sendJsonResponse(res, 404, { "message": "No crowdsales found under this ID" });
		   					return;
		      			} else {
		      				// If successful, build a JSON response with appropriate information
		      				var response = {
		      					project: {
		      						name: project.name,
		      						id: req.params.projectid,
		      					},
		      					token: {
		      						name: project.token.name,
		      						symbol: project.token.symbol,
		      						logo: project.token.logo
		      					},
		      					social: project.social,
		      					crowdsale: crowdsale
		      				};
		      				sendJsonResponse(res, 200, response);
		      			}

		      		} else {
		   				sendJsonResponse(res, 404, { "message": "No crowdsales found" });
		      		}
	      		}
	    	});
	   } else {
	   		// Else if no projectID was specified in the request, return custom error message
	   		sendJsonResponse(res, 404, { "message": "Not found, projectID and crowdsaleID required" });
	   }
};

// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.crowdsalesUpdateOne = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot update a crowdsale, the smart contract has now been released and will not be able to change."});
};

module.exports.toggleProgress = function (req, res) { 
	var project = req.params.projectid;
	var sale = req.params.crowdsaleid;

	if(project) {
		Project
			.find({subdomain: req.params.projectid})
			.exec( function(err, _project) {
				var project = _project[0];

				if (!project) {
				    sendJsonResponse(res, 404, { "message": "Project ID not found" });
				    return;
				} else if (err) {
				    sendJsonResponse(res, 400, err);
					return; 
				}
				
				// Upload information from correct values.
				var progress = project.crowdsales[sale].showprogress;
				project.crowdsales[sale].showprogress = !progress;

				// Try to save the project, return any validation errors if necessary
				project.save( function(err, project) {
					if (err) {
						console.log(err);
					    sendJsonResponse(res, 404, err);
					} else {
					    sendJsonResponse(res, 200, project);
					}
				});
			});
	} else {
    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
    	return;
	}
};

/* This function should firstly take in: projectid, item, crowdsaleid (optional) and discount code (optional)
 * It then loads the appropriate item (if crowdsale, loads the commission selected) 
 * It then looks up the discount code supplied against the list of discount codes in the DB
 * It then applies the discount to the item for the code and/or commission selected and stores in the DB
 * It then returns an object containing the price of the item in USD/ETH/BTC and the discount that has been applied
 */
module.exports.getPrice = function (req, res) { 

	// If the request parameters contains a project ID, then execute a query finding the object containing that id
	if (req.body && req.body.projectid && req.body.item) {

		if(req.body.item == 'crowdsale' && req.body.crowdsaleid){

			var item_price, total_price, discount, pricing, requestOptions, price_url;

			// Call the pricing URL to get accurate information on USD -> BTC/ETH prices
			price_url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH';

			requestOptions = {
				url : price_url,
				method : "GET",
				json : {}
			}; 

			request( requestOptions, function(err, response, body) {

				if(err){
	  				sendJsonResponse(res, 404, err);
	  				return;
				}

				// Set the crypto prices ready for conversion
				var eth = parseFloat(body.ETH);
				var btc = parseFloat(body.BTC);

				// Find the project and pass the object to the addCrowdsale function (below)
				Project
					.find({subdomain: req.body.projectid})
					.select('crowdsales')
					.exec(function(err, _project) {
						var project = _project[0];

						if(err){
							sendJsonResponse(res, 404, err);
							return;
						}

						var commission = project.crowdsales[req.body.crowdsaleid].commission;

						// We re-initialise it so that it can be found in Discount function below.
						var price = item_price;
						// Item price is $1999.99 for 1%, $1499.99 for 2%, $999.99 for 3% and $499.99 for 4% and FREE for 5%
						price = ((5 - commission) * 500);

						if(price != 0){
							price = price - 0.01;
						}

						var discount = project.crowdsales[req.body.crowdsaleid].discount_code;

						// Find the discount code and apply to price if necessary
						Discount
							.find({name: discount})
							.exec(function(err, _discount) {
								var discount = _discount[0];

								if(err){
									sendJsonResponse(res, 404, err);
									return;
								}

								if(discount){
									if(discount.type == 'percent'){
										// Work out the new item price given the discount.
										var discount_amount = discount.amount;									
										var take_off = 100 - discount_amount;
										take_off = take_off / 100;										
										price = price * take_off;
										price = price.toFixed(2);
									} else {
										var discount_amount = discount.amount;
										price = price - discount_amount;
									}
								}

								// Convert USD item price to ETH and BTC
								eth = eth * price;
								btc = btc * price;

								pricing = {
										dollars: price,
										eth: eth,
										btc: btc,
										item: req.body.item
									};
			  					
			  					sendJsonResponse(res, 200, pricing);

							});

					});

			});

		} else {
			// Else if no crowdsaleID was specified in the request, return custom error message
	  		sendJsonResponse(res, 404, { "message": "Not found, crowdsale ID required" });
		}

	} else {
		// Else if no projectID was specified in the request, return custom error message
	  	sendJsonResponse(res, 404, { "message": "Not found, project ID and/or item name is required" });
	}
};


// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.paymentConfirmOne = function (req, res) { 
	var projectid = req.params.projectid;
	var crowdsaleid = req.params.crowdsaleid;
	var createdDate;

	if(!projectid){
		sendJsonResponse(res, 404, {"message": "Not found, Project ID required"});
		return;
	} else if (!crowdsaleid){
		sendJsonResponse(res, 404, {"message": "Not found, Crowdsale ID required"});
		return;
	} else {
		// Find the project and pass the object to the addToken function (below)
		Project
			.find({subdomain: projectid})
			.select('crowdsales')
			.exec(function(err, _project) {
				var project = _project[0];
				
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else if (!project){
					sendJsonResponse(res, 404, {"message": "Project not found"});
				} else {
					var thisSale = project.crowdsales[crowdsaleid];

					if(thisSale){
						
						// Create a payment object if one doesnt already exist
						if(!thisSale.payment){
							thisSale.payment = {
								currency: '',
								paid: '',
								amount: 0,
								sentTo: '',
								created: '',
								createdBy: ''
							};
						}

						var payment = thisSale.payment;

						if(payment.paid == null){
						
							// Create wallet which either creates a new wallet and encrypts private key
							// Or loads existing keys from the DB if already used.
							var wallet;
							if(req.body.currency == 'eth' && !payment.ethWallet){
								// Create new wallet for taking payments
								wallet = paymentJS.createWallet('eth');
							} else if(req.body.currency == 'btc' && !payment.btcWallet){
								// Create new wallet for taking payments
								wallet = paymentJS.createWallet('btc');
							} else {
								if(req.body.currency == 'eth'){
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

							if(payment.created == null){
								createdDate = Date.now();
							} else {
								createdDate = thisSale.created;
							}

							payment.currency = req.body.currency;
							payment.amount = req.body.amount;
							payment.created = createdDate;
							payment.createdBy = req.body.createdBy;
							if(req.body.currency == 'eth'){
								payment.ethWallet = wallet;
							} else {
								payment.btcWallet = wallet;
							}

							// If they have paid, we must know what addresses to search for
							if(payment.paid && (!payment.sentTo)){
								sendJsonResponse(res, 404, {"message": "Must provide sent to address."});
								return;
							}

							project.save(function(err, project) {
							    if (err) {
							        sendJsonResponse(res, 404, err);
							    } else {
						    		tracking.paymentconfirmed(payment, 'crowdsale');
							        sendJsonResponse(res, 200, payment);
								} 
							});

						} else {
							sendJsonResponse(res, 404, {"message": "Already paid for!"});
						}

					} else {
						sendJsonResponse(res, 404, {"message": "Sale not found"});
					}
				}
			});
	}
};

// Function is used as callback to deal with the deposit wallet balance
// If the wallet balance is above the requested deposit amount, store item as 'paid'
// Else, return error.
var dealWithBalance = function(project, balance, saleid, res) {
	var payment = project.crowdsales[saleid].payment;

	// If balance is above or equal to amount needed
	if(balance >= payment.amount){

		// Set the payment date and store in DB as PAID
		payment.paid = Date.now();
		project.crowdsales[saleid].deployed = "Deploying";

		project.save(function(err, project) {
			if (err) {
				sendJsonResponse(res, 404, err);
			} else {
				tracking.paymentfinalised(payment, 'crowdsale');
				sendJsonResponse(res, 200, payment);
			} 
		});
	// Else, send an error message back saying amount not met.
	} else {
		sendJsonResponse(res, 404, {"message": "Deposit amount not met"});
	}
};

// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.paymentFinaliseOne = function (req, res) { 
	var projectid = req.params.projectid;
	var crowdsaleid = req.params.crowdsaleid;

	if(!projectid){
		sendJsonResponse(res, 404, {"message": "Not found, Project ID required"});
		return;
	} else if (!crowdsaleid){
		sendJsonResponse(res, 404, {"message": "Not found, Crowdsale ID required"});
		return;
	} else {
		// Find the project and pass the object to the addToken function (below)
		Project
			.find({subdomain: projectid})
			.select('crowdsales')
			.exec(function(err, _project) {
				var project = _project[0];
			
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else if (!project){
					sendJsonResponse(res, 404, {"message": "Project not found"});
				} else {
					var thisSale = project.crowdsales[crowdsaleid];

					if(thisSale){
						
						// Create a payment object if one doesnt already exist
						if(!thisSale.payment){
							sendJsonResponse(res, 404, {"message": "Must create a payment first!"});
							return;
						}

						var payment = thisSale.payment;

						if(payment.paid == null){
							var wallet_address;

							// Else if the payment has not yet been paid, get the balance and deal with it using the dealWithBalance function.
							if(payment.currency == 'eth'){
								wallet_address = payment.ethWallet.address;
							} else {
								wallet_address = payment.btcWallet.address;
							}

							var balance = paymentJS.getBalance(wallet_address, project, crowdsaleid, res, dealWithBalance);

						} else {
							sendJsonResponse(res, 404, {"message": "Already paid for!"});
						}

					} else {
						sendJsonResponse(res, 404, {"message": "Sale not found"});
					}
				}
			});
	}
};

module.exports.crowdsalesDeleteOne = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a crowdsale, the smart contract has now been released and will not be able to change."});
};