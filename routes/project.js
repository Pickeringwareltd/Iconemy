var express = require('express');
var project = require('../app_server/controllers/project');

// Forward request onto the main controller
module.exports = function (app) { 
	// Create project form
	app.get('/projects/create', project.create); 
	
	// Handle data sent by new project form
	app.post('/projects/create', project.doCreation); 

	// My projects points to users owned projects
	app.get('/projects', project.myprojects); 

	// Projects points to actual project pages
	app.get('/projects/:projectname', project.index); 

	// Update project details
	app.get('/projects/:projectname/update', project.update);

	app.post('/projects/:projectname/update', project.doUpdate);

	app.get('/projects/:projectname/buynow', project.buynow);

};