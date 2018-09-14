'use strict';

var express = require('express');
var token = require('../app_server/controllers/token');
var needsLogIn = require('./auth');
var onlyOwner = require('./onlyOwner');
var tracking = require('./add-ons/tracking');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/projects/:projectname/token', tracking.view, function(req, res){
	  	token.index(req, res);
	}); 
	app.get('/token', tracking.view, function(req, res){
		// If there is a subdomain attached, point to appropriate token
		if (req.subdomain) {
	  		token.index(req, res);
		}
	});

	// Get the creation form
	app.get('/projects/:projectname/token/create', needsLogIn, onlyOwner.require, tracking.view, token.create); 
	// Create the token
	app.post('/projects/:projectname/token/create', needsLogIn, onlyOwner.require, token.doCreation); 

}