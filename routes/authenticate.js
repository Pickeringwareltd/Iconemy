var express = require('express');

var authenticate = require('../app_server/controllers/authenticate');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/login', authenticate.login); 
	app.get('/signup', authenticate.signup); 
};