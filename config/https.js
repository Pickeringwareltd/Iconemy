'use strict';

module.exports.requireHTTPS = function(req, res, next) {
	try{
		// The 'x-forwarded-proto' check is for Heroku
		if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === "production") {
		  return res.redirect('https://' + req.get('host') + req.url);
		}

		next();
	} catch(e) {
		console.log('Error on server-side config https.js/requireHTTPS: ' + e);
	}
}