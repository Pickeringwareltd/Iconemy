var express = require('express');

var sale = require('../app_server/controllers/sale');

// Forward request onto the main controller
module.exports = function (app) { 
	// Return the creae crowdsale form
	app.get('/projects/:projectname/crowdsales/create', sale.create);

	// Use the submitted data from the form to do something
	app.post('/projects/:projectname/crowdsales/create', sale.doCreation);

	app.get('/projects/:projectname/crowdsales/:crowdsaleid', sale.index);  

	app.get('/crowdsales/:crowdsaleid', function(req, res){
		// If there is a subdomain attached, point to appropriate token
		if (req.subdomain) {
	  		sale.index(req, res);
		}
	});
};