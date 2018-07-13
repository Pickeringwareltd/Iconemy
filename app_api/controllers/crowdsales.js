var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var WAValidator = require('wallet-address-validator');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
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

var createWallet = function(){
	var address = '0x1043b9496f9437EFcEdeD91F9C55eACbC1D1bF8f';
	return address;
}

// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.paymentConfirmOne = function (req, res) { 
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

							var wallet_address = createWallet();

							if(payment.created == null){
								createdDate = Date.now();
							} else {
								createdDate = thisSale.created;
							}

							payment.currency = req.body.currency;
							payment.amount = req.body.amount;
							payment.sentTo = wallet_address;
							payment.created = createdDate;
							payment.createdBy = req.body.createdBy;

							// If they have paid, we must know what addresses to search for
							if(payment.paid && (!payment.sentTo)){
								sendJsonResponse(res, 404, {"message": "Must provide sent to address."});
								return;
							}

							project.save(function(err, project) {
							    if (err) {
							        sendJsonResponse(res, 404, err);
							    } else {
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

var getBalance = function(address){
	var balance = 0;

	// Also need to get address of sender

	return balance;
}

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
						if(payment.currency == 'eth'){
							var sentfrom_address = '0x1043b9496f9437EFcEdeD91F9C55eACbC1D1bF8f';
						} else {
							var sentfrom_address = '1GVY5eZvtc5bA6EFEGnpqJeHUC5YaV5dsb';
						}

						if(payment.paid == null){

							var wallet_address = payment.sentto;
							var balance = getBalance(wallet_address);

							if(balance >= payment.amount){
								console.log('Paid successfully');
							}

							if(payment.currency == 'eth' && !WAValidator.validate(sentfrom_address, 'ETH')){
								sendJsonResponse(res, 404, {"message": "Must be a valid ETH address!"});
								return;
							} else if(payment.currency == 'btc' && !WAValidator.validate(sentfrom_address, 'BTC')){
								sendJsonResponse(res, 404, {"message": "Must be a valid BTC address!"});
								return;
							}

							payment.paid = Date.now();
							payment.sentFrom = sentfrom_address;

							project.save(function(err, project) {
							    if (err) {
							        sendJsonResponse(res, 404, err);
							    } else {
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

module.exports.crowdsalesDeleteOne = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a crowdsale, the smart contract has now been released and will not be able to change."});
};