var express = require('express');
var token = require('../app_server/controllers/token');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/projects/:projectname/token', token.index); 
	app.get('/token/create', token.create); 
	app.get('/token', function(req, res){
		// If there is a subdomain attached, point to appropriate token
		if (req.subdomain) {
	  		token.index(req, res);
		}
	});
}