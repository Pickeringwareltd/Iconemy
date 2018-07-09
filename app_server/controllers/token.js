var express = require('express');
var request = require('request');
var WAValidator = require('wallet-address-validator');


var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

// Collates the API request for getting token information
var getRequestOptions = function(req, res){
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

	return requestOptions;
}

// Renders the token page depending on the API response information
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

// Main token controller for dealing with GET token requests
exports.index = function(req, res){
	var requestOptions = getRequestOptions(req, res);

   	request( requestOptions, function(err, response, body) {
      	renderToken(req, res, body);
   	});
};

// Renders the create token form
var renderCreateToken = function(req, res, responseBody){
	var message;

	if(!responseBody.token){
		if(req.query.err){
			if(req.query.err == 'nodata'){
				message = 'All fields marked with * are required!';
			} else if(req.query.err == 'invalidaddress'){
				message = 'Please provide a valid eth address';
			}
		}
		res.render('create_token', { 
			title: 'Create token',
			message: message 
		});
	} else {
		res.render('error', { 
			message: 'You can only create one token per project',
			error: {
				status: 404
			}
		});
	}
}

// Create token controller for dealing with GET requests to the create token form.
exports.create = function(req, res){
	var requestOptions = getRequestOptions(req, res);

   	request( requestOptions, function(err, response, body) {
      	renderCreateToken(req, res, body);
   	});
};

// Create token controller for dealing with POST requests containing actual new token data.
exports.doCreation = function(req, res){
	var requestOptions, path, projectname, postdata;

  	projectname = req.params.projectname;

  	path = "/api/projects/" + projectname + '/token';
  	
  	postdata = {
    	name: req.body.token_name,
    	symbol: req.body.token_symbol,
    	decimals: parseInt(req.body.token_decimals),
    	owner: req.body.owner_address,
    	logo: 'images/donut_logo.png',
    	createdBy: 'Jack'
	};

	requestOptions = {
  		url : apiOptions.server + path,
  		method : "POST",
  		json : postdata
	}; 

	// Check the fields are present
	if (!postdata.name || !postdata.symbol || !postdata.decimals || !postdata.owner) {
  		res.redirect('/projects/' + projectname + '/token/create?err=nodata');
	} else if(!WAValidator.validate(postdata.owner, 'ETH')){
  		res.redirect('/projects/' + projectname + '/token/create?err=invalidaddress');
	} else {

		request( requestOptions, function(err, response, body) {
	        if (response.statusCode === 201) {
	        	res.redirect('/pay');
	        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
				res.redirect('/projects/' + projectname + '/token/create?err=val');
	      	} else {
	        	res.render('error', { 
					message: body.message,
					error: {
						status: 404
					}
				});
			} 
		});
	}

};