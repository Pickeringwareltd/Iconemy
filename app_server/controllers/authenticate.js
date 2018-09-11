'use strict';

var express = require('express');

exports.login = function(req, res){
	res.render('login', { title: 'Log In' });
};

exports.signup = function(req, res){
	res.render('signup', { title: 'Sign up' });
};