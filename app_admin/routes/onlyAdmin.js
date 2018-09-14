'use strict';

var express = require('express');
var request = require('request');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var apiOptions = {
  server : "http://localhost:3000"
};

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  	apiOptions.server = "http://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

exports.require = function(req, res, next){
	try{
		if(req.session.loggedIn){
			var requestOptions = getRequestOptions(req, res);

		   	request( requestOptions, function(err, response, body) {
		      	checkAdmin(req, res, body, next);
		   	});
		} else {
			res.redirect('/');
		}
	} catch(e) {
		console.log('Error on admin routes onlyAdmin.js/require: ' + e);
	}
};

var getRequestOptions = function(req, res){
	try{
		var requestOptions, path, access_token;

		// Make sure we are using the correct subdomain
		var userid =  req.session.passport.user.user.id;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/user/' + userid;

	  	access_token = req.session.passport.user.tokens.access_token;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {},
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		};

		return requestOptions;
	} catch(e) {
		console.log('Error on admin routes onlyAdmin.js/getRequestOptions: ' + e);
	}
};

var checkAdmin = function(req, res, body, next){
	try{
		var data = body;

		if(data.result === 'admin'){
			next();
		} else {
			res.redirect('/');
		}
	} catch(e) {
		console.log('Error on admin routes onlyAdmin.js/checkAdmin: ' + e);
	}
};
