var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

exports.index = function(req, res){
	res.render('sale_interaction', { 
		title: 'Sale',
		sale: {
			name: 'Donut sale',
			symbol: 'DNT',
			logo: 'images/donut_logo.png',
			social: {
				facebook: 'https://www.facebook.com/donut',
				twitter: 'https://www.twitter.com/donut', 
				youtube: 'https://www.youtube.com/donut',
				github: 'https://www.github.com/donut',
				bitcointalk: 'https://www.bitcointalk.com/donut',
				medium: 'https://www.medium.com/donut' 
			}
		}
	});
};

exports.create = function(req, res){
	res.render('create_sale', { 
		title: 'Create sale',
		token : {
			name: 'Donut',
			symbol:'DNT'
		}
	});
};