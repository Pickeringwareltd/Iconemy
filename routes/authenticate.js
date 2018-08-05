const express = require('express');
const passport = require('passport');
const request = require('request');
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var callback_url = 'http://localhost:3000/authenticate';
var audience = 'http://localhost:3000/api';
// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  callback_url = 'http://www.iconemy.io/authenticate';
  audience = 'http://www.iconemy.io/api';
}

const env = {
  AUTH0_CLIENT_ID: 'tPqT4H0hgXromr4kzHiBIcHKWhAQyKay',
  AUTH0_DOMAIN: 'damp-surf-6213.auth0.com',
  AUTH0_CALLBACK_URL: callback_url,
  AUTH0_AUDIENCE: audience
};

var project = require('../app_server/controllers/project');

// Forward request onto the main controller
module.exports = function (app) { 

	// Perform the login
	app.get('/login',  passport.authenticate('auth0', {
	    clientID: env.AUTH0_CLIENT_ID,
	    domain: env.AUTH0_DOMAIN,
	    redirectUri: env.AUTH0_CALLBACK_URL,
	    audience: env.AUTH0_AUDIENCE,
	    responseType: 'code',
	    scope: 'openid profile'
	  }),
	  function(req, res) {
		console.log('login callback called');

	    res.redirect('/');
	  }
	);

	// Perform session logout and redirect to homepage
	app.get('/logout', (req, res) => {
		// Remove session so cant be used again
		req.session.destroy(function (err) {
		    res.redirect('/');
		});
	});

	// The callback used for authorising users is called by Auth0 after a user logs in/registers
	// The request given to this URI contains an 'authorisation code' which can be sent to '/oauth/token'
	// This then returns some JWT tokens for this user
	// We must store the JWT access token so the user can access the API securely
	// We must store the JWT ID token so we can identify a user when they come back to the site
	// We must store the JWTs in a session and pass the session ID into a cookie so that we can keep users logged in
	app.get('/authenticate', passport.authenticate('auth0', { failureRedirect: '/' }), 
		function(req, res) {

		 	if(req.query.code){
		 		req.session.loggedIn = true;

		 		if(req.session.returnTo == '/'){
		 			req.session.returnTo = '/projects';
		 		}

	   			res.redirect(req.session.returnTo || '/projects');
    			delete req.session.returnTo;
			} else {
				console.log('AUTHENTICATION ERROR: No authorization code supplied');
			}
	  	}
	);

};