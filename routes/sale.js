var express = require('express');

var sale = require('../app_server/controllers/sale');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/sale', sale.index); 
	app.get('/sale/create', sale.create); 
};