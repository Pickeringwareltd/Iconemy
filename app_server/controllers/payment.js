var express = require('express');

exports.index = function(req, res){
	res.render('make_payment', { title: 'Pay' });
};
