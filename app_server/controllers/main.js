var express = require('express');
var Keen = require('keen-js');

exports.index = function(req, res){
	// Configure instance. Only projectId and writeKey are required to send data.
	var keenio = new Keen({
		projectId: process.env['KEEN_PROJECT_ID'],
		writeKey: process.env['KEEN_WRITE_KEY']
	});

	// Log the page visit with Keen IO
	keenio.addEvent("landing_page_visit", {}, function(err, res) {
	    if (err) {
	        console.log("Oh no, an error!");
	    } else {
	        console.log("Hooray, it worked!");
	    }
	});

	res.render('index', { title: 'Iconemy' });
};