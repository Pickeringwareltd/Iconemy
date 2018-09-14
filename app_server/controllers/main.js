'use strict';

var express = require('express');
const errors = require('../../add-ons/errors');

exports.index = function(req, res){
	res.render('index', { title: 'Iconemy' });
};