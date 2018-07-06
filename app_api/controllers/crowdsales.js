var mongoose = require('mongoose');
var Project = mongoose.model('Project');

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
			.findById(project)
			.select('token crowdsales')
			.exec(function(err, project) {
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else {
					var token = project.token;

					if(project.crowdsales.length > 0 ){
						var lastSale = project.crowdsales[project.crowdsales.length - 1];

						if(lastSale.end > new Date(req.body.start)){
							sendJsonResponse(res, 404, {"message": "Your sale must start after the previous sale has finished."});
							return;						
						}
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
		// Push the new crowdsale object into the projects crowdsale array
    	project.crowdsales.push(getCrowdsale(req));

    	// Save the new parent document(project)
    	project.save(function(err, project) {
      
      		var thisCrowdsale;
      		
      		if (err) {
        		sendJsonResponse(res, 400, err);
     	 	} else {
     	 		// only return the recently added crowdsale (which is the last one in the array)
				thisCrowdsale = project.crowdsales[project.crowdsales.length - 1];
				sendJsonResponse(res, 201, thisCrowdsale);
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
		public: req.body.public,
		commission: req.body.commission,
		created: Date.now(),
		createdBy: req.body.createdBy,
		payment: {
			currency: req.body.pay_currency,
			amount: req.body.pay_amount,
			created: Date.now(),
			createdBy: req.body.createdBy
		} 
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
	    	.select('name social crowdsales')
	    	.exec(function(err, project) {
	    		// If no project is found, return custom error message
	      		if (!project) {
	          		sendJsonResponse(res, 404, { "message": "projectID not found" });
	          		return;
	          		// If an error was returned, return that message
	          	} else if (err) {
	          		sendJsonResponse(res, 404, err);
	          		return;
	      		} else {


	      			// -----------------------------------------------------------------------------------------
	      			// PROBLEM IS HERE --- PROJECT CROWDSALES IS UNDEFINED 
		      		console.log('project = ' + project.name);

		      		if(project.crowdsales && project.crowdsales.length > 0){
		      			var crowdsale = project.crowdsales[req.params.crowdsaleid];

		      			if(!crowdsale){
		   					sendJsonResponse(res, 404, { "message": "No crowdsales found under this ID" });
		   					return;
		      			} else {
		      				// If successful, build a JSON response with appropriate information
		      				var response = {
		      					project: {
		      						name: project.name,
		      						id: req.params.projectid
		      					},
		      					crowdsale: crowdsale
		      				};
		      				sendJsonResponse(res, 200, crowdsale);
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

// As we are dealing with smart contracts, we cannot allow users to update and/or delete crowdsales as the smart contract will remain on the network
module.exports.paymentUpdateOne = function (req, res) { 
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
			.findById(projectid)
			.select('crowdsales')
			.exec(function(err, project) {
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				} else if (!project){
					sendJsonResponse(res, 404, {"message": "Project not found"});
				} else {
					var thisSale = project.crowdsales[crowdsaleid];

					if(thisSale){
						var payment = thisSale.payment;

						payment.currency = req.body.currency;
						payment.amount = req.body.amount;
						payment.paid = req.body.paid;
						payment.sentTo = req.body.sentto;
						payment.sentFrom = req.body.sentfrom;

						// If they have paid, we must know what addresses to search for
						if(payment.paid && (!payment.sentTo || !payment.sentFrom)){
							sendJsonResponse(res, 404, {"message": "Must provide sent to and from addresses."});
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
						sendJsonResponse(res, 404, {"message": "Sale not found"});
					}
				}
			});
	}
};

module.exports.crowdsalesDeleteOne = function (req, res) { 
	sendJsonResponse(res, 404, {"message" : "You cannot delete a crowdsale, the smart contract has now been released and will not be able to change."});
};