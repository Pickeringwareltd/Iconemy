var express = require('express');

exports.login = function(req, res){
	console.log(req.user);
	res.render('login', { title: 'Log In' });
};

exports.signup = function(req, res){
	res.render('signup', { title: 'Sign up' });
};