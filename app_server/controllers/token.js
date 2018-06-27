var express = require('express');

exports.index = function(req, res){
	res.render('token_interaction', { 
		title: 'Token',
		token: {
			name: 'Donut Ads',
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
	res.render('create_token', { title: 'Create token' });
};