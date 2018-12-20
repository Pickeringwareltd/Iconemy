'use strict';

var request = require('request');
const errors = require('../../add-ons/errors');

var apiOptions = {
  server : "http://127.0.0.1:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

var renderIndex = function(req, res, responseBody){
	try{
		var data;

		if(responseBody.length > 0){
			// Need to render crowdsale dates properly
			data = { listings: responseBody };
			res.render('index_investors', data);
		} else {
			res.render('error', { 
				title: 'error',
				message: 'We couldnt find what you were looking for!',
				error: {
					status: 404
				}
			});
		}
	} catch(e) {
		errors.print(e, 'Error on server-side campaign.js/renderListings: ');
	}
}

exports.index = function(req, res){
	try{
		var requestOptions, path;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/campaigns';
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderIndex(req, res, body);
	   	});
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/index: ');
	}
};
