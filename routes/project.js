var express = require('express');
var project = require('../app_server/controllers/project');
var needsLogIn = require('./auth');
var onlyOwner = require('./onlyOwner');

// Forward request onto the main controller
module.exports = function (app) { 
	// Create project form
	app.get('/projects/create', needsLogIn, project.create); 
	
	// Handle data sent by new project form
	app.post('/projects/create', needsLogIn, project.doCreation); 

	// My projects points to users owned projects
	app.get('/projects', needsLogIn, project.myprojects); 

	// Projects points to actual project pages
	app.get('/projects/:projectname', project.index); 

	// Update project details
	app.get('/projects/:projectname/update', needsLogIn, onlyOwner.require, project.update);

	app.post('/projects/:projectname/update', needsLogIn, onlyOwner.require, project.doUpdate);

	app.get('/projects/:projectname/buynow', project.buynow);

};