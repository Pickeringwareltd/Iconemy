var express = require('express');
var ctrl = require('../app_server/controllers/main');

// Forward request onto the main controller
module.exports = function (app) { 
	app.get('/', ctrl.index); 
};