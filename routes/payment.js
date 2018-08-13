var express = require('express');
var payment = require('../app_server/controllers/payment');
var needsLogIn = require('./auth');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/pay', needsLogIn, payment.create); 

	// Should really be post
	app.get('/pay/finalise', needsLogIn, payment.confirm); 
	app.put('/pay/finalise', needsLogIn, payment.finalise); 
};