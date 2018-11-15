'use strict';

var express = require('express');

// Forward request onto the main controller
module.exports = function (app) {
	app.get('/owners/blog', function(req, res) {
	  	res.render('blog_archive_dark');
	});  
	app.get('/owners/blog/icos_arent_dead_stos_not_a_replacement', function(req, res) {
	  	res.render('articles/dark_icos_arent_dead_stos_not_a_replacement');
	});  
	app.get('/owners/blog/how_to_stop_ico_exit_scams', function(req, res) {
	  	res.render('articles/dark_how_to_stop_ico_exit_scams');
	}); 
	app.get('/owners/blog/why_do_we_need_cryptocurrencies', function(req, res) {
	  	res.render('articles/dark_why_we_need_cryptocurrencies');
	}); 
	app.get('/investors/blog', function(req, res) {
	  	res.render('blog_archive_light');
	});   
	app.get('/investors/blog/icos_arent_dead_stos_not_a_replacement', function(req, res) {
	  	res.render('articles/light_icos_arent_dead_stos_not_a_replacement');
	});  
	app.get('/investors/blog/how_to_stop_ico_exit_scams', function(req, res) {
	  	res.render('articles/light_how_to_stop_ico_exit_scams');
	});  
	app.get('/investors/blog/why_do_we_need_cryptocurrencies', function(req, res) {
	  	res.render('articles/light_why_we_need_cryptocurrencies');
	}); 
};