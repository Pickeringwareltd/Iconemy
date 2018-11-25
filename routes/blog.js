'use strict';

var express = require('express');
const Article = require('../app_api/models/article')

// Forward request onto the main controller
module.exports = function (app) {
	app.get('/blog', function(req, res) {
		Article
			.find()
			.sort({ created_at: -1 })
			.limit(4)
			.exec((err, articles) => {
				if (err) return res.render('blog_archive_dark', { articles: [] })

                return res.render('blog_archive_dark', { articles: articles })
            })
	  	res.render('blog_archive_dark');
	});  
	app.get('/blog/:slug', function(req, res) {
		Article
			.findOne({ slug: req.params.slug })
			.exec((err, article) => {
                if (err) return res.redirect('/')

				if (! article) return res.redirect('/')

                return res.render('articles/view', { article: article })
            })
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
	app.get('/investors/blog/why_is_it_so_hard_to_invest_in_icos', function(req, res) {
	  	res.render('articles/light_why_is_it_so_hard_to_invest_in_icos');
	}); 
};