'use strict';

var express = require('express');

// Forward request onto the main controller
module.exports = function (app) {
	app.get('/ico/dashboard', function(req, res) {
	  	res.render('ico_dashboard/dashboard');
	}); 
	app.get('/ico/dashboard/team', function(req, res) {
	  	res.render('ico_dashboard/team');
	});   
	app.get('/ico/dashboard/community', function(req, res) {
	  	res.render('ico_dashboard/community');
	});  
	app.get('/ico/dashboard/transactions', function(req, res) {
	  	res.render('ico_dashboard/transactions');
	});  
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
	app.get('/ico/dashboard/how-to', function(req, res) {
	  	res.render('ico_dashboard/how-to');
	}); 
};