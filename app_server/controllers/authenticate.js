var express = require('express');

exports.login = function(req, res){
	res.render('login', { title: 'Login' });
};

exports.signup = function(req, res){
	res.render('signup', { title: 'Sign up' });
};