var express = require('express');

exports.index = function(req, res){
	res.render('sale_interaction', { title: 'Sale' });
};

exports.create = function(req, res){
	res.render('create_sale', { title: 'Create sale' });
};