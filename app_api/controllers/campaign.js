'use strict';

var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');
var User = mongoose.model('User');
var tracking = require('../../add-ons/tracking');
const errors = require('../../add-ons/errors');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.campaignsListByStartTime = function (req, res) { 
	try{
		// Get all campaigns and sort by the date created in descending order (newest first)
		Campaign
			.find()
			.sort('-created')
			.exec(function(err, campaigns) {
				// If no project is found, return custom error message
		      	if (!campaigns) {
		          	sendJsonResponse(res, 404, { "message": "No campaigns found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		        	errors.print(err , 'Error getting campaigns listed by start time: ');
		         	sendJsonResponse(res, 404, 'Error getting campaigns listed by start time');
		          	return;
		      	} else {
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, campaigns);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers campaigns.js/projectsListByStartTime: ');
	}
};

module.exports.campaignsReadOne = function (req, res) { 
	try{
		// If the request parameters contains a campaign ID, then execute a query finding the object containing that id
		if (req.params && req.params.campaignid) {
			// Call the Project model function to find the ID passed as a request parameter in the URL
			// I.e. api/campaigns/123
			// Execute the query and return a JSON response including the campaign found or an error
			Campaign
		    	.find({domain: req.params.campaignid})
		    	.exec(function(err, campaign) {

		    		// If no project is found, return custom error message
		      		if (!campaign || campaign === '') {
		          		sendJsonResponse(res, 404, { "message": "campaignID not found" });
		          		// MUST RETURN AFTER ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
		          		return;
		          		// If an error was returned, return that message
		          	} else if (err) {
		          		errors.print(err , 'Error getting campaigns to read: ');
		          		sendJsonResponse(res, 404, 'Error getting campaigns to read');
		          		return;
		      		} else {
		      			// If project was found and no error returned then return the campaign
		      			sendJsonResponse(res, 200, campaign);
		      		}
		    	});

		   } else {
		   		// Else if no projectID was specified in the request, return custom error message
		   		sendJsonResponse(res, 404, { "message": "No campaignID in request" });
		   }
	} catch(e) {
		errors.print(e, 'Error on API controllers campaigns.js/campaignsReadOne: ');
	}
};

module.exports.teamReadOne = function (req, res) { 
	try{

		// If the request parameters contains a campaign ID, then execute a query finding the object containing that id
		if (req.params && req.params.campaignid) {
			// Call the Project model function to find the ID passed as a request parameter in the URL
			// I.e. api/campaigns/123
			// Execute the query and return a JSON response including the campaign found or an error
			Campaign
		    	.find({domain: req.params.campaignid})
		    	.select('team')
		    	.exec(function(err, team) {

		    		// If no project is found, return custom error message
		      		if (!team || team === '') {
		          		sendJsonResponse(res, 404, { "message": "teamID not found" });
		          		// MUST RETURN AFTER ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
		          		return;
		          		// If an error was returned, return that message
		          	} else if (err) {
		          		errors.print(err , 'Error getting teams to read: ');
		          		sendJsonResponse(res, 404, 'Error getting teams to read');
		          		return;
		      		} else {
		      			// If project was found and no error returned then return the campaign
		      			sendJsonResponse(res, 200, team);
		      		}
		    	});

		   } else {
		   		// Else if no projectID was specified in the request, return custom error message
		   		sendJsonResponse(res, 404, { "message": "No teamID in request" });
		   }
	} catch(e) {
		errors.print(e, 'Error on API controllers campaigns.js/campaignsReadOne: ');
	}
};

module.exports.communityReadOne = function (req, res) { 
	try{

		// If the request parameters contains a campaign ID, then execute a query finding the object containing that id
		if (req.params && req.params.campaignid) {
			// Call the Project model function to find the ID passed as a request parameter in the URL
			// I.e. api/campaigns/123
			// Execute the query and return a JSON response including the campaign found or an error
			Campaign
		    	.find({domain: req.params.campaignid})
		    	.exec(function(err, campaign) {

		    		// If no project is found, return custom error message
		      		if (!campaign || campaign === '') {
		          		sendJsonResponse(res, 404, { "message": "campaignID not found" });
		          		// MUST RETURN AFTER ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
		          		return;
		          		// If an error was returned, return that message
		          	} else if (err) {
		          		errors.print(err , 'Error getting campaigns to read: ');
		          		sendJsonResponse(res, 404, 'Error getting campaigns to read');
		          		return;
		      		} else {
		      			// If project was found and no error returned then return the campaign
		      			sendJsonResponse(res, 200, campaign);
		      		}
		    	});

		   } else {
		   		// Else if no projectID was specified in the request, return custom error message
		   		sendJsonResponse(res, 404, { "message": "No campaignID in request" });
		   }
	} catch(e) {
		errors.print(e, 'Error on API controllers campaigns.js/campaignsReadOne: ');
	}
};

module.exports.transactionsReadOne = function (req, res) { 
	try{

		// If the request parameters contains a campaign ID, then execute a query finding the object containing that id
		if (req.params && req.params.campaignid) {
			// Call the Project model function to find the ID passed as a request parameter in the URL
			// I.e. api/campaigns/123
			// Execute the query and return a JSON response including the campaign found or an error
			Campaign
		    	.find({domain: req.params.campaignid})
		    	.exec(function(err, campaign) {

		    		// If no project is found, return custom error message
		      		if (!campaign || campaign === '') {
		          		sendJsonResponse(res, 404, { "message": "campaignID not found" });
		          		// MUST RETURN AFTER ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
		          		return;
		          		// If an error was returned, return that message
		          	} else if (err) {
		          		errors.print(err , 'Error getting campaigns to read: ');
		          		sendJsonResponse(res, 404, 'Error getting campaigns to read');
		          		return;
		      		} else {
		      			// If project was found and no error returned then return the campaign
		      			sendJsonResponse(res, 200, campaign);
		      		}
		    	});

		   } else {
		   		// Else if no projectID was specified in the request, return custom error message
		   		sendJsonResponse(res, 404, { "message": "No campaignID in request" });
		   }
	} catch(e) {
		errors.print(e, 'Error on API controllers campaigns.js/campaignsReadOne: ');
	}
};

module.exports.recordPurchase = function(req, res){
	try{

		var campaign = req.params.campaignid;
		var userid = "5be068bd34ea5b5e7beee8ff";

		var transactionObj = {
			tx_id: req.body.tx_id,
			timestamp: req.body.timestamp,
			introducer: req.body.introducer,
			campaign_id: campaign,
			tokens: req.body.tokens,
			bonus_tokens: req.body.bonus_tokens,
			ether: req.body.ether,
			address: req.body.address,
			successful: req.body.successful,
			error: req.body.error
		}

		// Find the project and pass the object to the addEmails function (below)
		User
			.findById(userid, function(err, _user) {
				var user = _user;

				if(err){
					errors.print(err, 'Error getting user to record purchase'); 
					sendJsonResponse(res, 400, 'Error getting user to record purchase');
					return;
				} else {
					addPurchase(req, res, transactionObj, user);
				}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers campaign.js/recordPurchase: ');
	}
}

var addPurchase = function(req, res, transactionObj, user) {
	try{
	  	if (!user) {
	    	sendJsonResponse(res, 400, { "message": "You must supply user ID" });
	    	return;
		} else {

			var index = user.transactions.length;

			transactionObj.index = index;

			// Push the new purchase object into the crowdsales emails array
	    	user.transactions.push(transactionObj);

	    	// Save the new parent document(project)
	    	user.save(function(err, _user) {
	      
	      		if (err) {
	      			errors.print(err, 'Error adding purchase ');
	        		sendJsonResponse(res, 400, 'Error adding purchase');
	     	 	} else {
					// sendEmails.sendEmail(user.email);
	     	 		// only return the recently added crowdsale (which is the last one in the array)
					sendJsonResponse(res, 201, transactionObj);
	    		} 
	    	});
		} 
	} catch(e) {
		errors.print(e, 'Error on API controllers campaign.js/addPurchase: ');
	}
};