'use strict';

var express = require('express');
const errors = require('./add-ons/errors');

exports.index = function(req, res){

	e = 'THIS IS AN ERROR';

	errors.print(e, 'Test errors working: ');
	res.render('index', { title: 'Iconemy' });
};