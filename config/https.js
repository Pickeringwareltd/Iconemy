'use strict';

const errors = require('../add-ons/errors');

module.exports.requireHTTPS = function(req, res, next) {
	try{

		var env = false;

		if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"){
			env = true;
		}

		// The 'x-forwarded-proto' check is for Heroku
		if (!req.secure && req.get('x-forwarded-proto') !== 'https' && env) {
		  return res.redirect('https://' + req.get('host') + req.url);
		}

		next();
	} catch(e) {
		errors.print(e, 'Error on server-side config https.js/requireHTTPS: ');
	}
}