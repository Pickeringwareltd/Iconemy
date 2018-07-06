var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Require the connection to the database (mongoose)
require('./app_api/models/db');
var routesApi = require('./app_api/routes/index');

var app = express();

// Specify where the views are found
app.set('views', path.join(__dirname, '/app_server/views'));
// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
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

// require that the app sends requests to the routes folder (index.js)
require('./routes')(app);
app.use('/api', routesApi);

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
