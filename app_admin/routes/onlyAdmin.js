var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var checkAdmin = function(req, res, _userid, next){

	User
		.find({userid: _userid})
		.exec( function(err, data) {

			var user = data[0];

			if(user.length == 0){
				sendJsonResponse(res, 400, { "message": "User doesnt exist" });
				return;
			} else if(err != undefined) {
				sendJsonResponse(res, 404, { "message": err });
				return;	
			} else {				
				if(user.role === 'admin'){
					next();
				} else {
					res.redirect('/');
				}
			}
		});

};

exports.require = function(req, res, next){

	// The user being logged is checked by the needsLogIn middleware
	// The user MUST be logged in and MUST be the owner of the resource
	// Need to get the user object from the request (if none, redirect to log in)
	// Need to search the token in the request and get the 'createdBy' variable
	// If the userID is equal to the createdBy then grant access, if not, return error to project page saying must be owner

	// We extract the userID from the access token such that we can make sure the logged in user is the owner of the resource
	var access_token = req.headers.authorization.substr(7, req.headers.authorization.length);
	var token = jwt.decode(access_token);
	var userid = token.sub;

	if(userid != undefined){
	    checkAdmin(req, res, userid, next);
	} else {
		sendJsonResponse(401, {'message' : 'Not logged in'});
	}
};
