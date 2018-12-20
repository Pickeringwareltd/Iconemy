'use strict';

var express = require('express');
var ctrl = require('../app_server/controllers/main');
const project = require('../app_server/controllers/project');
const dashboard = require('../app_server/controllers/dashboard');
const landing = require('../app_server/controllers/main');
const tracking = require('../add-ons/tracking');
const errors = require('../add-ons/errors');
const fs = require('fs');

// Forward request onto the main controller
module.exports = function (app) {
	// Render home page if no subdomain added OR render project if one is added.
	app.get('/', tracking.view, landing.index); 

	// Render new landing
	app.get('/investors', function(req, res) {
	  	res.render('index_investors');
	});

	// Render new landing
	app.get('/owners', function(req, res) {
	  	res.render('index_owners');
	});

	// Render new landing
	app.get('/experts', function(req, res) {
	  	res.render('experts_dark');
	});

	// Render new landing
	app.get('/listing', dashboard.listing);

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