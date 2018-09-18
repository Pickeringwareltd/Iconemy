'use strict';

require('newrelic');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const tracking = require('./add-ons/tracking');
const ether_socket = require('./app_api/websocket/ws');
const https = require('./config/https');

// Require the connection to the database (mongoose)
require('./app_api/models/db');

// Require passport configuration
require('./config/passport');

var api_routes = require('./app_api/routes/index');
var admin_routes = require('./app_admin/routes/index');

var app = express();

// Different logging is required depending on the server it is on.
require('./config/logging')(app);

// Force the user to connect via HTTPS
app.use(https.requireHTTPS);

// Force the user to connect via HSTS (HTTP String Transport Security)
app.use(function (req, res, next) {
  var aYear = 60 * 60 * 24 * 365;
  // Set the Strict Transport Security header for a year
  // Also include subdomains
  res.set('Strict-Transport-Security','max-age=' + aYear + ';includeSubdomains');

  next();
});

// ******************************************* SESSION STORE ***********************************
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var dbURI = 'mongodb://localhost/iconemy';

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  dbURI = process.env.MONGOLAB_URI;
}

// Start the websocket vonnected to the INFURA MAINNET which will constantly pick up transactions relating to Iconemys contracts
// It then parses and stores each transaction in the DB
// ether_socket.start();

var session_store = new MongoDBStore({
  uri: dbURI,
  collection: 'mySessions'
});
  
session_store.on('connected', function() {
  console.log('Session store connectd to: ' + dbURI);
  session_store.client; // The underlying MongoClient object from the MongoDB driver
});
   
// Catch errors
session_store.on('error', function(error) {
  console.log('Session store ERROR: ' + error);
});

// declare the use of sessions in the app in order to run authentication with OAuth
app.use(session({ 
  resave: true,
  saveUninitialized: true,
  secret: 'the super important secret for iconemy',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, //one week
    httpOnly: true
  },
  store: session_store
}));

app.use(passport.initialize());
app.use(passport.session());
// ******************************************* END SESSION STORE ***********************************
// Specify where the views are found
app.set('views', [path.join(__dirname, '/app_server/views'), path.join(__dirname, '/app_admin/views')]);
// view engine setup
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Specify where the static files are found
app.use(express.static(path.join(__dirname, 'public')));

// This is necessary to include subdomains wihtout having to add 'www' after
app.set('subdomain offset', 1);
// get dynamic subdomains for the projects (if any)
app.use(function(req, res, next) {
  if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
  // otherwise we have subdomain here
  var subdomain = req.subdomains.slice(-1)[0];
  // keep it
  req.subdomain = subdomain;

  next();
});

app.use(function(req, res, next) {
  res.locals.loggedIn = false;

  if(req.session.loggedIn){ 
      res.locals.loggedIn = true;
  } else {
    // If user has not logged in yet, set the 'return to' session path to previous url
    if(req.path != '/authenticate' && req.path != '/login'){
        req.session.returnTo = req.path;
    }
  }
  next();
});

// require that the app sends requests to the routes folder (index.js)
require('./routes')(app);
app.use('/api', api_routes);
app.use('/admin', admin_routes);

// Catch unauthorised errors and redirect users to log in page
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.redirect('/login');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
