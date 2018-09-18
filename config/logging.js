const path = require('path');
const logger = require('morgan');
const uuid = require('node-uuid');
const fs = require('fs');
const rfs = require('rotating-file-stream');

// For more information on the morgan module see here: https://github.com/expressjs/morgan

// This module takes care of the logs on the server.
module.exports = function(app){
	// This allows us to specify what we'd like to log in production vs staging and development. 
	if(process.env.NODE_ENV === 'production'){
		// This will be used to store a unique ID to each request in the logs
		logger.token('id', function getId (req) {
		  return req.id
		});

		// ensure log directory exists
		var logDirectory = path.join(__dirname, '/../log');
		fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

		// create a rotating write stream
		var accessLogStream = rfs('access.log', {
		    interval: '1d', // rotate daily
		    path: logDirectory
		});

		app.use(assignId);
		app.use(logger(':id | [:date[web]] | :method | :url | :status | :res[content-length] | in :response-time ms | :referrer | :remote-addr | :user-agent', { stream: accessLogStream }));
	} else {
		app.use(logger('dev'));
	}

	// This assigns each request with a unique id in order to trace each request in the logs
	function assignId (req, res, next) {
		req.id = uuid.v4()
		next()
	}
};