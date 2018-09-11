'use strict';

// Refer to routes/main.js
module.exports = function(app){
	require('./main')(app);
	require('./authenticate')(app);
	require('./project')(app);
	require('./token')(app);
	require('./sale')(app);
	require('./payment')(app);
};