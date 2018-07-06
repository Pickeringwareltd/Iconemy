var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

var renderProject = function(req, res, responseBody){

	if(responseBody[0]){
		// Need to render crowdsale dates properly
		data = responseBody[0];

		var i;
		for (i = 0; i < data.crowdsales.length; i++) { 
			data.crowdsales[i].start = renderDate(data.crowdsales[i].start);
			data.crowdsales[i].end = renderDate(data.crowdsales[i].end);
		}

		res.render('project_interaction', { 
			title: responseBody.name,
			projectInfo: data
		});
	} else {
		res.render('error', { 
			title: 'error',
			message: 'Sorry something have gone wrong!',
			error: {
				status: 404
			}
		});
	}
}

var renderDate =  function(_date) {

	var date = new Date(_date);
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var d = date.getDate();
	var m = monthNames[date.getMonth()];
	var y = date.getFullYear();
	date = d + ' ' + m + ' ' + y;

	return date;
}

exports.index = function(req, res){
	var requestOptions, path;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects/' + req.params.subdomain;
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderProject(req, res, body);
   	});
};

exports.create = function(req, res){
	res.render('create_project', { 
		title: 'Create project'
	});
};

var renderMyProjects = function(req, res, responseBody){
	var message;

	// Return appropriate error message if necessary
	if (!(responseBody instanceof Array)) {
		message = "API lookup error, try refreshing the page'";
		responseBody = [];
	} else {
		if (!responseBody.length) {
	    	message = "No project found!";
		} 	
	}

	res.render('my_projects', { 
		title: 'My projects',
		crowdsales: responseBody,
		message: message
	});
}

exports.myprojects = function(req, res){

  	var requestOptions, path;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects';
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderMyProjects(req, res, body);
   	});
};