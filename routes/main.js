var express = require('express');
var ctrl = require('../app_server/controllers/main');
var project = require('../app_server/controllers/project');

// Forward request onto the main controller
module.exports = function (app) {
	// Render home page if no subdomain added OR render project if one is added.
	app.get('/', function(req, res) {
		// If there is a subdomain attached, point to appropriate project
		if (req.subdomain) {
	  		project.index(req, res);
		} else {
	  		res.render('index');
		}
	}); 
};