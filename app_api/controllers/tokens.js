var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var WAValidator = require('wallet-address-validator');

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
		      					social: project.social
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

// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.paymentUpdate = function (req, res) { 

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
						if(!payment.created){
							createdDate = Date.now();
						} else {
							createdDate = project.token.created;
						}

						var payment = project.token.payment;

						payment.currency = req.body.currency;
						payment.amount = req.body.amount;
						payment.paid = req.body.paid;
						payment.sentTo = req.body.sentto;
						payment.sentFrom = req.body.sentfrom;
						payment.created = createdDate;
						payment.createdBy = req.body.createdBy;

						project.save(function(err, project) {
						    if (err) {
						        sendJsonResponse(res, 404, err);
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

module.exports.tokenDelete = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a token, the smart contract has now been released and will not be able to change."});
};