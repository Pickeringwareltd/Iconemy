'use strict';

var express = require('express');
var ctrl = require('../app_server/controllers/main');
const project = require('../app_server/controllers/project');
const tracking = require('../add-ons/tracking');
const errors = require('../add-ons/errors');
const fs = require('fs');

// Forward request onto the main controller
module.exports = function (app) {
	// Render home page if no subdomain added OR render project if one is added.
	app.get('/', tracking.view, function(req, res) {

		// If there is a subdomain attached, point to appropriate project
		if (req.subdomain) {
	  		project.index(req, res);
		}

	  	res.render('index');
	}); 

	// Render home page if no subdomain added OR render project if one is added.
	app.get('/googlead8304f00c758c64.html', function(req, res) {

		console.log('called');

	  	res.send('googlead8304f00c758c64.html');
	}); 

	app.get('/buynow', tracking.view, function(req, res) {
		// If there is a subdomain attached, point to appropriate project
		if (req.subdomain) {
	  		project.buynow(req, res);
		}
	}); 

	app.get('/privacy', tracking.view, function(req, res) {
		try{
			var privacyFile = "./public/privacy_policy.pdf";

			fs.readFile(privacyFile, function (err,data){
			  res.contentType("application/pdf");
			  res.send(data);
			});
		} catch(e) {
			errors.print(e, 'Error on server-side routes main.js/privacy: ');
		}
	}); 

	app.get('/terms', tracking.view, function(req, res) {
		try{
		    var termsFile = "./public/terms_conditions.pdf";

		    fs.readFile(termsFile, function (err,data){
		      res.contentType("application/pdf");
		      res.send(data);
		    });
		} catch(e) {
			errors.print(e, 'Error on server-side routes main.js/terms: ');
		}
	}); 
};