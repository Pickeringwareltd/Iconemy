var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/iconemy';
mongoose.connect(dbURI);

// Events that will log to console when fired
// Connection established
mongoose.connection.on('connected', function () {
 console.log('Mongoose connected to ' + dbURI);
});

// Error in connection
mongoose.connection.on('error',function (err) {
 console.log('Mongoose connection error: ' + err);
});

// Connection disabled
mongoose.connection.on('disconnected', function () {
 console.log('Mongoose disconnected');
}); 

// Graceful shutdown is necessary to shutdown redundant DB connections after the server shuts down/restarts
var gracefulShutdown = function (msg, callback) {
	// Closing connection is asynchronous so we wait until that is done then call the callback passed as param2
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through ' + msg);
		callback();
 	});
};

// SIGUSR2 is the signal emitted by nodemon when the server restarts automatically
process.once('SIGUSR2', function () {
	// Call function with additional callback function as it is asynchronous
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
 	});
});

// SIGINT is the signal emitted by node.js when the server shuts down
process.on('SIGINT', function () {
	gracefulShutdown('app termination', function () {
		process.exit(0);
 	});
});

// SIGTERM is the signal emitted by heroku when the server shuts down
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
		process.exit(0);
	});
});

// Require and include the projects schema
require('./projects');