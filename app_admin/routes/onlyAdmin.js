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
}


exports.require = function(req, res, next){
	if(req.session.loggedIn){
		var requestOptions = getRequestOptions(req, res);

	   	request( requestOptions, function(err, response, body) {
	      	checkAdmin(req, res, body, next);
	   	});
	} else {
		res.redirect('/');
	}
};

var getRequestOptions = function(req, res){
	var requestOptions, path;

	// Make sure we are using the correct subdomain
	var userid =  req.session.passport.user.user.id;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/user/' + userid;

  	var access_token = req.session.passport.user.tokens.access_token;
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {},
  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
	};

	return requestOptions;
};

var checkAdmin = function(req, res, body, next){
	var data = body;

	if(data.result === 'admin'){
		next();
	} else {
		res.redirect('/');
	}
};
