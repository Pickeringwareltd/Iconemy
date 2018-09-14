'use strict';

var express = require('express');
var request = require('request');
const errors = require('../add-ons/errors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var apiOptions = {
  server : "http://localhost:3000"
};

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  	apiOptions.server = "http://www.iconemy.io";
}

if (process.env.USING_STAGING === 'true'){
  apiOptions.server = process.env.STAGING_URL;
}

exports.require = function(req, res, next){
	try {
		// The user being logged is checked by the needsLogIn middleware
		// The user MUST be logged in and MUST be the owner of the resource
		// Need to get the user object from the request (if none, redirect to log in)
		// Need to search the token in the request and get the 'createdBy' variable
		// If the userID is equal to the createdBy then grant access, if not, return error to project page saying must be owner
		if(req.session.loggedIn){
			var requestOptions = getRequestOptions(req, res);

		   	request( requestOptions, function(err, response, body) {
		      	checkOwner(req, res, body, next);
		   	});
		}
	} catch(e) {
		errors.print(e, 'Error on server-side routes onlyOwner.js/require: ');
	}
};

var getRequestOptions = function(req, res){
	try{
		var requestOptions, path;

		// Make sure we are using the correct subdomain
		var projectName =  req.params.projectname;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	var path = '/api/projects/' + projectName;

	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {}
		};

		return requestOptions;
	} catch(e) {
		errors.print(e, 'Error on server-side routes onlyOwner.js/getRequestOptions: ');
	}
};

var checkOwner = function(req, res, body, next){
	try{
		var project = body[0];
		var owner = project.createdBy;

		if(owner === req.session.passport.user.user.id){
			next();
		} else {
			res.redirect('/projects');
		}
	} catch(e) {
		errors.print(e, 'Error on server-side routes onlyOwner.js/checkOwner: ');
		res.redirect('/projects');
	}
};
