var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

var renderToken = function(req, res, responseBody) {
	if(!responseBody.message){
		res.render('token_interaction', { 
			title: 'Token',
			token: responseBody.token
		});
	} else {
		res.render('error', { 
			title: 'error',
			message: responseBody.message,
			error: {
				status: 404
			}
		});
	}
}

exports.index = function(req, res){
	var requestOptions, path;

	// Make sure we are using the correct subdomain
	var projectName =  req.params.projectname;

	if(projectName == undefined){
		projectName = req.subdomains;
	}

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects/' + projectName + '/token';
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderToken(req, res, body);
   	});
};

exports.create = function(req, res){
	res.render('create_token', { title: 'Create token' });
};