'use strict';

var checkEnv = function(_err, _message){
	if (process.env.NODE_ENV === 'production') {
		// If in production, simply print internal server error.
		return 'Internal server error';
	} else if (process.env.NODE_ENV === 'staging'){
		// If staging, print where the error comes from
		return 'Internal server error - ' + _message;
	} else {
		// If in development mode, print entire stack trace
		return _message + ' ' + _err; 
	}
}

// This is fired whenever an error is found, we then track the error and print an appropriate error message
module.exports.print = function(_err, _message){
	try{

		// This allows us to print error messages based off environment
		var error = checkEnv(_err, _message);
		console.log(error);

	} catch(e) {
		console.log('Error logging error in print: ' + e);
	}
}; 
