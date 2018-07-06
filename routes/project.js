var express = require('express');
var project = require('../app_server/controllers/project');

// Forward request onto the main controller
module.exports = function (app) { 
	// My projects points to users owned projects
	app.get('/projects', project.myprojects); 

	// Projects points to actual project pages
	app.get('/projects/:projectname', project.index); 
	
	app.get('/project/create', project.create); 
};