var express = require('express');

exports.index = function(req, res){
	res.render('token_interaction', { title: 'Token' });
};

exports.create = function(req, res){
	res.render('create_token', { title: 'Create token' });
};