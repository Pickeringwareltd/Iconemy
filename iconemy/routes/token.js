var express = require('express');

var token = require('../app_server/controllers/token');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/token', token.index); 
	app.get('/token/create', token.create); 
};