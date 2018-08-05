var express = require('express');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var jwt = require('jsonwebtoken');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var checkOwner = function(req, res, userid, next){

	Project
		.find({subdomain: req.params.projectid})
		.exec( function(err, data) {

			var project = data[0];

			if(project.length == 0){
				sendJsonResponse(res, 400, { "message": "Project doesnt exist" });
				return;
			} else if(err != undefined) {
				sendJsonResponse(res, 404, { "message": err });
				return;	
			} else {
				var owner = project.createdBy;
				
				if(owner === userid){
					next();
				} else {
					res.redirect('/projects/' + project.subdomain);
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
	    checkOwner(req, res, userid, next);
	} else {
		sendJsonResponse(401, {'message' : 'Not logged in'});
	}
};
