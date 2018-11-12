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

	// Render new landing
	app.get('/new', function(req, res) {
	  	res.render('new_landing');
	}); 

	// Render new landing
	app.get('/new2', function(req, res) {
	  	res.render('index_investors');
	});

	// Render new landing
	app.get('/new_dark', function(req, res) {
	  	res.render('index_investors_dark');
	});

	// Render new landing
	app.get('/experts', function(req, res) {
	  	res.render('experts_dark');
	});

	// Render blog page
	app.get('/blog_dark', tracking.view, function(req, res) {
	  	res.render('blog_archive_dark');
	}); 

	// Render blog page
	app.get('/blog_dark/single', tracking.view, function(req, res) {
	  	res.render('blog_single_dark');
	}); 

	// Render blog page
	app.get('/blog_light', tracking.view, function(req, res) {
	  	res.render('blog_archive_light');
	}); 

	// Render blog page
	app.get('/blog_light/single', tracking.view, function(req, res) {
	  	res.render('blog_single_light');
	}); 

	// Render blog page
	app.get('/blog', tracking.view, function(req, res) {
	  	res.render('blog_home');
	}); 

	// Render blog single
	app.get('/blog/single', tracking.view, function(req, res) {
	  	res.render('blog_single');
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