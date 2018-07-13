var express = require('express');
var payment = require('../app_server/controllers/payment');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/pay', payment.index); 

	// Should really be post
	app.get('/pay/finalise', payment.create); 
	app.put('/pay/finalise', payment.finalise); 
};