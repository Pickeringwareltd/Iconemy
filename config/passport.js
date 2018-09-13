'use strict';

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var callback_url = 'http://localhost:3000/authenticate';

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  callback_url = 'https://www.iconemy.io/authenticate';
} 

if (process.env.USING_STAGING === 'true'){
  var url = process.env.STAGING_URL;

  callback_url = url + '/authenticate';
}

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET ,
    callbackURL: callback_url
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // Add the tokens to the user object in request
    var accessToken = accessToken;
    var idToken = extraParams.id_token;
    var user = {};

    user.profile = profile;
    
    user.tokens = {
      access_token: accessToken,
      id_token: idToken
    };

    return done(null, user);
  }
);

passport.use(strategy);

// These functions are used to store and collect user data from a session. 
// For example, you could store just the userID in the session by returning done(null, user.id)
// This would store the user ID in the session.
passport.serializeUser(function(user, done) {

  // We only need to store the user ID and the tokens for authentication
  var session_store = {
    user: user.profile,
    tokens: user.tokens
  };

  done(null, session_store);
});

// You could then retrieve the user id from the session, collect the user objects and add that to the request. 
passport.deserializeUser(function(session_store, done) {
  done(null, session_store);
});
