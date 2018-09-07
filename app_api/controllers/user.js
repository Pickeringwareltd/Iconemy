var mongoose = require('mongoose');
var validator = require('validator');
var User = mongoose.model('User');
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
	  templateId: 'd-a863d706bc2a48d59b76150a51aa7048'
	};

	sgMail.send(msg);
};

// This is used to check if the user is an admin or a user (and has access to the admin section)
module.exports.checkRole = function (req, res) { 
	var id = req.params.userid;

	User
		.find({userid: id})
		.exec( function(err, user) {

			if(user.length != 0){

				var user = user[0];

				if(user.role == 'admin'){
					sendJsonResponse(res, 200, { "result": 'admin' });
					return;						
				} else {
					sendJsonResponse(res, 200, { "result": 'user' });
					return;		
				}

			} else if(err != undefined) {
				sendJsonResponse(res, 404, { "result": "error", "message": err });
				return;	
			}
		});
};

var getUserData = function(req){
	var data = {
				userid: req.body.userid,
				email: req.body.email
				};

	return data;
}

module.exports.checkLogIn = function (req, res) { 

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
					sendJsonResponse(res, 404, { "result": "error", "message": err });
					return;	
				} else {

					// Create subscription creates a new document in the database
					User
						.create(data, function(err, user) {
							// Callback is used to report an error or return project on successful save
							   if (err) {
							      sendJsonResponse(res, 400, { "result": "error", "message": err });
							      return;
							   } else {
							   	  // Track user sign up
							   	  tracking.registration(user.email, user.userid);
							   	  sendEmail(user.email);
							      sendJsonResponse(res, 201, { "result": "created" });
							   }
						}); 
				}
			});
		} else {
			sendJsonResponse(res, 400, { "result": "error", "message": "Please enter a valid email address" });
			return;
		}
};
