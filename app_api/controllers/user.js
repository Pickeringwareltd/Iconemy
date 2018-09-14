'use strict';

var mongoose = require('mongoose');
var validator = require('validator');
var User = mongoose.model('User');
var tracking = require('../../add-ons/tracking');
var errors = require('../../add-ons/errors');
const sendEmail = require('../../add-ons/emails');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// This is used to check if the user is an admin or a user (and has access to the admin section)
module.exports.checkRole = function (req, res) { 
	try{
		var id = req.params.userid;

		User
			.find({userid: id})
			.exec( function(err, user) {

				if(user.length != 0){

					var user = user[0];

					if(user.role === 'admin'){
						sendJsonResponse(res, 200, { "result": 'admin' });
						return;						
					} else {
						sendJsonResponse(res, 200, { "result": 'user' });
						return;		
					}

				} else if(err != undefined) {
					errors.print(err, 'Error getting user: ');
					sendJsonResponse(res, 404, { "result": "error", "message": 'Error getting user' });
					return;	
				}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers user.js/checkRole: ');
	}
};

var getUserData = function(req){
	try{
		var data = {
					userid: req.body.userid,
					email: req.body.email
					};

		return data;
	} catch(e) {
		errors.print(e, 'Error on API controllers user.js/getUserData: ');
	}
}

module.exports.checkLogIn = function (req, res) { 
	try{

		var data = getUserData(req);

		if(validator.isEmail(data.email)){

			User
				.find({userid: data.userid})
				.exec( function(err, user) {

					if(user.length != 0){

						var user = user[0];

						tracking.login(req, user.email, user.userid);
						sendJsonResponse(res, 200, { "result": "existing" });
						return;
					} else if(err != undefined) {
						errors.print(err, 'Error getting user data');
						sendJsonResponse(res, 404, { "result": "error", "message": 'Error getting user data' });
						return;	
					} else {

						// Create subscription creates a new document in the database
						User
							.create(data, function(err, user) {
								// Callback is used to report an error or return project on successful save
								   if (err) {
								   	  errors.print(err, 'Error saving user: ');
								      sendJsonResponse(res, 400, { "result": "error", "message": 'Error saving user' });
								      return;
								   } else {
								   	  // Track user sign up
								   	  tracking.registration(user.email, user.userid);
								   	  sendEmail.sendSignUpEmail(user.email);
								      sendJsonResponse(res, 201, { "result": "created" });
								   }
							}); 
					}
				});
			} else {
				sendJsonResponse(res, 400, { "result": "error", "message": "Please enter a valid email address" });
				return;
			}

	} catch(e) {
		errors.print(e, 'Error on API controllers user.js/checkLogIn: ');
	}
};
