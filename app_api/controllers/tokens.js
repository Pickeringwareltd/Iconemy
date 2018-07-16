var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var WAValidator = require('wallet-address-validator');
var paymentJS = require('./payment_util');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.tokenCreate = function (req, res) { 
	// To add a crowdsale, you must first find the parent document (project), add the subdocument (crowdsale) to it and restore.
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

				if(err){
					sendJsonResponse(res, 404, err);
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
};

var addToken = function(req, res, project) {
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
        		sendJsonResponse(res, 400, err);
     	 	} else {
     	 		// Return newly created token
				sendJsonResponse(res, 201, project.token);
    		} 

    	});
	} 
};

var validateToken = function(token){
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
}

// Creates crowdsale object from form data ready to be added to a project
var getToken = function(req) {
	var token = {
		name: req.body.name,
		symbol: req.body.symbol,
		decimals: req.body.decimals,
		owner: req.body.owner,
		logo: req.body.logo,
		created: Date.now(),
		createdBy: req.body.createdBy
	}

	return token;
};

module.exports.tokenRead = function (req, res) { 
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
	          		sendJsonResponse(res, 404, err);
	          		return;
	      		} else {
	      			var token = project.token;

		      		if(!token){
		      			sendJsonResponse(res, 404, { "message": "Token does not exist" });
		          		return;
		      		} else {
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
		      					deployed: token.deployed
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
};

// As we are dealing with smart contracts, we cannot allow users to update and/or delete tokens as the smart contract will remain on the network
module.exports.tokenUpdate = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot update a token, the smart contract has now been released and will not be able to change."});
};

// Confirming payments is necessary to store payments for later use, i.e. users may create a token and then pay a week later, confirming the payment optin allows us to create a wallet for deposit
module.exports.paymentConfirm = function (req, res) { 

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
					sendJsonResponse(res, 404, err);
					return;
				} else if (!project){
					sendJsonResponse(res, 404, {"message": "Project not found"});
				} else {
					if(project.token){
						var createdDate;

						if(project.token.payment == undefined){
							project.token.payment = {};
							createdDate = Date.now();
						} else {
							createdDate = project.token.created;
						}

						var payment = project.token.payment;
							
						// Create wallet which either creates a new wallet and encrypts private key
						// Or loads existing keys from the DB if already used.
						var wallet;
						if(payment.currency != req.body.currency || !payment.sentTo){
							// Create new wallet for taking payments
							wallet = paymentJS.createWallet(req.body.currency);
						} else {
							wallet = {
								address: payment.sentTo,
								privateKey: payment.seed
							};
						}

						if(req.body.currency == 'eth' && !WAValidator.validate(wallet.address, 'ETH')){
							sendJsonResponse(res, 404, {"message": "Must be a valid ETH address!"});
							return;
						} else if(req.body.currency == 'btc' && !WAValidator.validate(wallet.address, 'BTC')){
							sendJsonResponse(res, 404, {"message": "Must be a valid BTC address!"});
							return;
						}

						payment.currency = req.body.currency;
						payment.amount = req.body.amount;
						payment.sentTo = wallet.address;
						payment.seed = wallet.privateKey;
						payment.created = createdDate;
						payment.createdBy = 'Jack';

						project.save(function(err, project) {
						    if (err) {
						    	console.log(err);
						        sendJsonResponse(res, 404, {"message": err});
						    } else {
						        sendJsonResponse(res, 200, payment);
							} 
						});

					} else {
						sendJsonResponse(res, 404, {"message": "Token not found"});
					}
				}
			});
	}

};

// Function is used as callback to deal with the deposit wallet balance
// If the wallet balance is above the requested deposit amount, store item as 'paid'
// Else, return error.
var dealWithBalance = function(project, balance, res) {
	var payment = project.token.payment;

	if(balance >= payment.amount){

		payment.paid = Date.now();

		project.save(function(err, project) {
			if (err) {
				sendJsonResponse(res, 404, {"message": err});
			} else {
				sendJsonResponse(res, 200, payment);
			} 
		});
									
	} else {
		sendJsonResponse(res, 404, {"message": "Deposit amount not met"});
	}
};

// Finalise payment by checking if wallet is funded and setting contract to paid, this will then trigger the deployment
module.exports.paymentFinalise = function (req, res) { 

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
					sendJsonResponse(res, 404, err);
					return;
				} else if (!project){
					sendJsonResponse(res, 404, {"message": "Project not found"});
				} else {
					if(project.token){
						var createdDate;
						var payment = project.token.payment;

						if(payment){

							if(!payment.paid){

								var wallet_address = payment.sentTo;

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

};

module.exports.tokenDelete = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a token, the smart contract has now been released and will not be able to change."});
};