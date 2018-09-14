'use strict';

var mongoose = require('mongoose');
var validator = require('validator');
var Subscription = mongoose.model('Subscription');
var Contact = mongoose.model('Contact');
var tracking = require('../../add-ons/tracking');
const errors = require('../../add-ons/errors');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var getSubscriptionData = function(req){
	try{
		var data = {
					email: req.body.youremail,
					time: Date.now(),
					mailing_list: false
					};

		return data;
	} catch(e) {
		errors.print(e, 'Error on API controllers contact.js/getSubscriptionData: ');
	}
}

module.exports.subscribe = function (req, res) { 
	try{
		var data = getSubscriptionData(req);

		if(validator.isEmail(data.email)){

			Subscription
				.find({email: req.body.youremail})
				.exec( function(err, subscription) {

					if(subscription.length != 0){
						sendJsonResponse(res, 400, { "result": "error", "message": "Subscription already exists." });
						return;
					} else if(err != undefined) {
						sendJsonResponse(res, 404, { "result": "error", "message": err });
						return;	
					} else {

						Subscription
						    .find({email: req.body.email})
						    .exec(function(err, subscription) {
						         	// Create subscription creates a new document in the database
									Subscription
										.create(data, function(err, subscription) {
											// Callback is used to report an error or return project on successful save
								    		if (err) {
								    			errors.print(err, 'Error adding subscription: ');
								      			sendJsonResponse(res, 400, { "result": "error", "message": 'Error adding subscription' });
								      			return;
								    		} else {
								    			tracking.subscribe(req);
								      			sendJsonResponse(res, 201, { "result": "success", "message": "Thank you for subscribing! We will be in touch shortly." });
								    		}
										}); 
						    });
					}
				});
			} else {
				sendJsonResponse(res, 400, { "result": "error", "message": "Please enter a valid email address" });
				return;
			}
	} catch(e) {
		errors.print(e, 'Error on API controllers contact.js/subscribe: ');
	}
};

var getContactData = function(req){
	try{
		var data = {
					name: req.body.name,
					email: req.body.email,
					message: req.body.message,
					time: Date.now(),
					responded: false
					};

		return data;
	} catch(e) {
		errors.print(e, 'Error on API controllers contact.js/getContactData: ');
	}
}

module.exports.contact = function (req, res) { 
	try{
		var data = getContactData(req);

		if(validator.isEmail(data.email)){

			Contact
				.find({email: data.email})
				.exec( function(err, messages) {

					if(messages.length != 0){
						sendJsonResponse(res, 400, { "result": "error", "message": "Apologies, we will reply to your first message as soon as we can." });
						return;
					} else if(err != undefined) {
						errors.print(err, 'Error finding contact data: ');
						sendJsonResponse(res, 404, { "result": "error", "message": 'Error finding contact data' });
						return;	
					} else {

						Contact
						    .find({email: data.email})
						    .exec(function(err, messages) {
						         	// Create subscription creates a new document in the database
									Contact
										.create(data, function(err, messages) {
											// Callback is used to report an error or return project on successful save
								    		if (err) {
								    			errors.print(err, 'Error storing contact data: ');
								      			sendJsonResponse(res, 400, { "result": "error", "message": 'Error storing contact data' });
								      			return;
								    		} else {
								    			tracking.contact(req);
								      			sendJsonResponse(res, 201, { "result": "success", "message": "Thank you for reaching out! We will be in touch shortly." });
								    		}
										}); 
						    });
					}
				});
			} else {
				sendJsonResponse(res, 400, { "result": "error", "message": "Please enter a valid email address" });
				return;
			}
	} catch(e) {
		errors.print(e, 'Error on API controllers contact.js/contact: ');
	}
};
