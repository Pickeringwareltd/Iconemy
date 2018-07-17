var express = require('express');
var payment = require('../app_server/controllers/payment');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/pay', payment.create); 

	// Should really be post
	app.get('/pay/finalise', payment.confirm); 
	app.put('/pay/finalise', payment.finalise); 
};