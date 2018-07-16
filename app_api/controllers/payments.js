var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var WAValidator = require('wallet-address-validator');
var paymentJS = require('./payment_util');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* This function should firstly take in: projectid, item, crowdsaleid (optional) and discount code (optional)
 * It then loads the appropriate item (if crowdsale, loads the commission selected) 
 * It then looks up the discount code supplied against the list of discount codes in the DB
 * It then applies the discount to the item for the code and/or commission selected and stores in the DB
 * It then returns an object containing the price of the item in USD/ETH/BTC and the discount that has been applied
 */
module.exports.createPayment = function (req, res) { 
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

