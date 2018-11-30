'use strict';

var express = require('express');
var dashboard = require('../app_server/controllers/dashboard');
var tracking = require('../add-ons/tracking');
var needsLogIn = require('./auth');

// Forward request onto the main controller
module.exports = function (app) {
	app.get('/campaign/:campaignName', dashboard.index);
	 
	app.get('/campaign/:campaignName/team', dashboard.team);   

	app.get('/campaign/:campaignName/community', dashboard.community);

	app.get('/campaign/:campaignName/transactions', needsLogIn, dashboard.transactions);  
	
	app.get('/ico/dashboard/smartdrop', function(req, res) {
	  	res.render('ico_dashboard/smartdrop');
	});  
	app.get('/ico/dashboard/login', function(req, res) {
	  	res.render('ico_dashboard/login');
	});  
	app.get('/ico/dashboard/signup', function(req, res) {
	  	res.render('ico_dashboard/signup');
	}); 
	app.get('/ico/dashboard/confirm', function(req, res) {
	  	res.render('ico_dashboard/signup-success');
	});  
	app.get('/ico/dashboard/reset', function(req, res) {
	  	res.render('ico_dashboard/recovery');
	});   
	app.get('/ico/dashboard/account', function(req, res) {
	  	res.render('ico_dashboard/account');
	}); 
	app.get('/ico/dashboard/faq', function(req, res) {
	  	res.render('ico_dashboard/faq');
	}); 
	app.get('/ico/dashboard/how-to', dashboard.how_to); 
};