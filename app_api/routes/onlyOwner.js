'use strict';

var express = require('express');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var jwt = require('jsonwebtoken');
const errors = require('../../add-ons/errors');

var sendJsonResponse = function(res, status, content) {
    return res.status(status).json(content);
};

var checkOwner = function(req, res, userid, next){
	try{
		Project
			.find({subdomain: req.params.projectid})
			.exec( function(err, data) {
                var project = data[0];

				if(project.length === 0){
					return sendJsonResponse(res, 400, { "message": "Project doesnt exist" });
				} else if(err != undefined) {
					return sendJsonResponse(res, 404, { "message": err });
				} else {
					var owner = project.createdBy;
					
					if(owner == userid){
                        return next();
					} else {
						return res.redirect('/projects/' + project.subdomain);
					}

				}
			});
	} catch(e) {
		errors.print(e, 'Error on API routes onlyOwner.js/checkOwner: ');
	}
};

exports.require = function(req, res, next){
	try{
		// The user being logged is checked by the needsLogIn middleware
		// The user MUST be logged in and MUST be the owner of the resource
		// Need to get the user object from the request (if none, redirect to log in)
		// Need to search the token in the request and get the 'createdBy' variable
		// If the userID is equal to the createdBy then grant access, if not, return error to project page saying must be owner

		// We extract the userID from the access token such that we can make sure the logged in user is the owner of the resource

        if(req.user){
            return checkOwner(req, res, req.user._id, next);
		} else {
			return sendJsonResponse(401, {'message' : 'Not logged in'});
		}
	} catch(e) {
		errors.print(e, 'Error on API routes onlyOwner.js/require: ');
	}
};
