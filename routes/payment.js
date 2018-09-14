'use strict';

var express = require('express');
var payment = require('../app_server/controllers/payment');
var needsLogIn = require('./auth');
var tracking = require('./add-ons/tracking');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/pay', needsLogIn, tracking.view, payment.create); 

	// Should really be post
	app.get('/pay/finalise', needsLogIn, tracking.view, payment.confirm); 
	app.put('/pay/finalise', needsLogIn, payment.finalise); 
};