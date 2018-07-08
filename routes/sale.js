var express = require('express');

var sale = require('../app_server/controllers/sale');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/projects/:projectname/crowdsales/create', sale.create);

	app.get('/projects/:projectname/crowdsales/:crowdsaleid', sale.index);  

	app.get('/crowdsales/:crowdsaleid', function(req, res){
		// If there is a subdomain attached, point to appropriate token
		if (req.subdomain) {
	  		sale.index(req, res);
		}
	});
};