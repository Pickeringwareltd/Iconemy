'use strict';

var express = require('express');
var project = require('../app_server/controllers/project');
var needsLogIn = require('./auth');
var onlyOwner = require('./onlyOwner');
var tracking = require('../tracking/tracking');

// Forward request onto the main controller
module.exports = function (app) { 
	// Create project form
	app.get('/projects/create', needsLogIn, tracking.view, project.create); 
	
	// Handle data sent by new project form
	app.post('/projects/create', needsLogIn, project.doCreation); 

	// My projects points to users owned projects
	app.get('/projects', needsLogIn, tracking.view, project.myprojects); 

	// Projects points to actual project pages
	app.get('/projects/:projectname', tracking.view, project.index); 

	// Update project details
	app.get('/projects/:projectname/update', needsLogIn, onlyOwner.require, tracking.view, project.update);

	app.post('/projects/:projectname/update', needsLogIn, onlyOwner.require, project.doUpdate);

	app.get('/projects/:projectname/buynow', tracking.view, project.buynow);

};