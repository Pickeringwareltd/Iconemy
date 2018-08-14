var mongoose = require('mongoose');
var validator = require('validator');
var User = mongoose.model('User');
var tracking = require('../../tracking/tracking');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
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
