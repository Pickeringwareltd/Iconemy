const express = require('express');
const passport = require('passport');
const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: 'tPqT4H0hgXromr4kzHiBIcHKWhAQyKay',
  AUTH0_DOMAIN: 'damp-surf-6213.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:5000/usercallback'
};

var project = require('../app_server/controllers/project');

// Forward request onto the main controller
module.exports = function (app) { 

	// Perform the login
	app.get('/login', passport.authenticate('auth0', {
	    clientID: env.AUTH0_CLIENT_ID,
	    domain: env.AUTH0_DOMAIN,
	    redirectUri: env.AUTH0_CALLBACK_URL,
	    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
	    responseType: 'code',
	    scope: 'openid profile'
	  }),
	  function(req, res) {
	    res.redirect('/');
	  }
	);

	// Perform session logout and redirect to homepage
	app.get('/logout', (req, res) => {
	  req.logout();
	  res.redirect('/');
	});

	// Perform the final stage of authentication and redirect to '/myprojects controller'
	app.get('/usercallback', passport.authenticate('auth0', { failureRedirect: '/' }), project.myprojects );

};