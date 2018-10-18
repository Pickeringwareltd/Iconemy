'use strict';

var express = require('express');
var sale = require('../app_server/controllers/sale');
var needsLogIn = require('./auth');
var onlyOwner = require('./onlyOwner');
var tracking = require('../add-ons/tracking')

// Forward request onto the main controller
module.exports = function (app) { 
	// Return the creae crowdsale form
	app.get('/projects/:projectname/crowdsales/create', needsLogIn, onlyOwner.require, tracking.view, sale.create);

	app.get('/projects/:projectname/crowdsales/:crowdsaleid/toggleprogress', needsLogIn, onlyOwner.require, sale.toggleProgress);

	// Use the submitted data from the form to do something
	app.post('/projects/:projectname/crowdsales/create', needsLogIn, onlyOwner.require, sale.doCreation);

	app.get('/projects/:projectname/crowdsales/:crowdsaleid', onlyOwner.check, tracking.view, sale.index);

	app.get('/projects/:projectname/crowdsales/:crowdsaleid/admin', tracking.view, onlyOwner.require, sale.saleAdmin);    

	app.get('/crowdsales/:crowdsaleid', tracking.view, function(req, res){
		// If there is a subdomain attached, point to appropriate token
		if (req.subdomain) {
	  		sale.index(req, res);
		}
	});
};