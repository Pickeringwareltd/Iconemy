'use strict';

const { check } = require('express-validator/check');
const owasp = require('owasp-password-strength-test');
owasp.config({ minLength : 6 });

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var callback_url = 'http://localhost:3000/authenticate';
var audience = 'http://localhost:3000/api';

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  callback_url = 'https://www.iconemy.io/authenticate';
  audience = 'https://www.iconemy.io/api';
} else if (process.env.NODE_ENV === 'staging'){
	callback_url = process.env.STAGING_URL + '/authenticate';
  	audience = process.env.STAGING_URL + '/api';
}

const authController = require('../app_server/controllers/authenticate')

module.exports = (app) => {
    app.get('/login', authController.showLoginForm);
    app.get('/signup', authController.showRegisterForm);
    app.get('/logout', authController.logout);
    app.get('/confirm', authController.confirm);
    app.get('/forgot-password', authController.forgot);
    app.post('/forgot-password', authController.send);
    app.get('/reset-password', authController.reset_form);
    app.post(
        '/reset-password',
        [
            check("password", "Passwords don't match")
                .custom((value,{req, loc, path}) => {
                    if (value !== req.body.repeat_password) {
                        // trow error if passwords do not match
                        throw new Error("Passwords don't match");
                    } else {
                        return value;
                    }
                }),
            check("password", "invalid password")
                .custom((value,{req, loc, path}) => {
                    let result = owasp.test(value);

                    if (! result.strong) {
                        throw new Error(result.errors.join('<br>'));
                    } else {
                        return value;
                    }
                })
        ],
        authController.reset);
};


// // Forward request onto the main controller
// module.exports = function (app) {
//     console.log(1);
//     // Perform the login
// 	app.get('/signup',  passport.authenticate('auth0', {
// 	    clientID: env.AUTH0_CLIENT_ID,
// 	    domain: env.AUTH0_DOMAIN,
// 	    redirectUri: env.AUTH0_CALLBACK_URL,
// 	    audience: env.AUTH0_AUDIENCE,
// 	    responseType: 'code',
// 	    scope: 'openid profile'
// 	  }),
// 	  function(req, res) {
// 	    res.redirect('/');
// 	  }
// 	);
//
// 	// Perform the login
// 	app.get('/login',  passport.authenticate('local', {
// 	    clientID: env.AUTH0_CLIENT_ID,
// 	    domain: env.AUTH0_DOMAIN,
// 	    redirectUri: env.AUTH0_CALLBACK_URL,
// 	    audience: env.AUTH0_AUDIENCE,
// 	    responseType: 'code',
// 	    scope: 'openid profile'
// 	  }),
// 	  function(req, res) {
// 	    res.redirect('/');
// 	  }
// 	);
//
// 	// Perform session logout and redirect to homepage
// 	app.get('/logout', (req, res) => {
// 		// Remove session so cant be used again
// 		req.session.destroy(function (err) {
// 		    res.redirect('/');
// 		});
// 	});
//
// 	// The callback used for authorising users is called by Auth0 after a user logs in/registers
// 	// The request given to this URI contains an 'authorisation code' which can be sent to '/oauth/token'
// 	// This then returns some JWT tokens for this user
// 	// We must store the JWT access token so the user can access the API securely
// 	// We must store the JWT ID token so we can identify a user when they come back to the site
// 	// We must store the JWTs in a session and pass the session ID into a cookie so that we can keep users logged in
// 	app.get('/authenticate', passport.authenticate('auth0', function(err, user, info) {
//         console.log("authenticate");
//         console.log(err);
//         console.log(user);
//         console.log(info);
//     }, { failureRedirect: '/' }, ),
// 		function(req, res) {
// 			console.log('called 4');
// 			try{
// 			 	if(req.query.code){
//
// 			 		req.session.loggedIn = true;
//
// 				  	const path = '/user';
//
// 				  	const access_token = req.session.passport.user.tokens.access_token;
//
// 				  	const requestOptions = {
// 				  		url: audience + path,
// 				  		method : "POST",
// 	  					headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' },
// 				  		json : {
// 				  			userid: req.user._id,
// 				  			email: req.session.passport.user.user.displayName
// 				  		}
// 					};
//
// 				   	request( requestOptions, function(err, response, body) {});
//
// 			 		if(req.session.returnTo === '/'){
// 			 			req.session.returnTo = '/projects';
// 			 		}
//
// 		   			res.redirect(req.session.returnTo || '/projects');
// 	    			req.session.returnTo = null;
// 				} else {
// 					console.log('AUTHENTICATION ERROR: No authorization code supplied');
// 				}
//
// 			} catch(e) {
// 				errors.print(e, 'Error on server-side routes authenticate.js/authenticate: ');
// 			}
//
// 	  	}
// 	);
//
// };