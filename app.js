'use strict';

require('newrelic');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash-notification');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const csrf = require('csurf');
const tracking = require('./add-ons/tracking');
const ether_socket = require('./app_api/websocket/ws');
const cors = require('cors');
const https = require('./config/https');
var app = express();

// Require the connection to the database (mongoose)
require('./app_api/models/db');

// Security
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// Different logging is required depending on the server it is on.
require('./config/logging')(app);

// Force the user to connect via HTTPS
app.use(https.requireHTTPS);

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// declare the use of sessions in the app in order to run authentication with OAuth
app.set('trust proxy', 1);
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'the super important secret for iconemy',
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, //one week
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true
    },
    store: session_store
}));
app.use(flash(app));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')
// ******************************************* END SESSION STORE ***********************************
// Specify where the views are found
app.set('views', [path.join(__dirname, '/app_server/views'), path.join(__dirname, '/app_admin/views')]);
// view engine setup
app.set('view engine', 'ejs');

// app.use(csrf({ cookie: true }));
app.use(function (req, res, next) {
    res.locals.csrf = '';

    next();
});

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

  if(req.cookies['jwt']){
      res.locals.loggedIn = true;
      res.locals.jwt = req.cookies['jwt'];
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
var api_routes = require('./app_api/routes/index');
var admin_routes = require('./app_admin/routes/index');
app.use('/api', api_routes);
app.use('/admin', admin_routes);

// Catch unauthorised errors and redirect users to log in page
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError' || err.name === 'Unauthorized') {
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
