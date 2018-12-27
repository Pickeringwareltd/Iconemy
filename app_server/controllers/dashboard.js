'use strict';

var express = require('express');
var request = require('request');
var tracking = require('../../add-ons/tracking');
const errors = require('../../add-ons/errors');

var apiOptions = {
  server : "http://127.0.0.1:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

var renderCampaign = function(req, res, responseBody){
	try{
		var data;

		if(responseBody[0] != ''){
			// Need to render crowdsale dates properly
			data = responseBody[0];

			res.render('ico_dashboard/dashboard', data);
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
		errors.print(e, 'Error on server-side campaign.js/renderCampaign: ');
	}
}

exports.index = function(req, res){
	try{

		var requestOptions, path, campaignName;

		// Make sure we are using the correct subdomain
		campaignName =  req.params.campaignName;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/campaigns/' + campaignName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderCampaign(req, res, body);
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

var renderListings = function(req, res, responseBody){
	try{
		var data;

		if(responseBody.length > 0){
			// Need to render crowdsale dates properly
			data = { listings: responseBody };
			res.render('listing', data);
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

exports.listing = function(req, res){
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
	      	renderListings(req, res, body);
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

var renderTeam = function(req, res, responseBody){
	try{
		var data;

		if(responseBody[0]){
			// Need to render crowdsale dates properly
			data = responseBody[0];
			
			res.render('ico_dashboard/team', data);
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
		errors.print(e, 'Error on server-side campaign.js/renderTeam: ');
	}
}

exports.team = function(req, res){
	try{

		var requestOptions, path, campaignName;
		// Make sure we are using the correct subdomain
		campaignName =  req.params.campaignName;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/campaigns/' + campaignName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderTeam(req, res, body);
	   	});
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

var renderCommunity = function(req, res, responseBody){
	try{
		var data;

		if(responseBody[0]){
			// Need to render crowdsale dates properly
			data = responseBody[0];
			
			res.render('ico_dashboard/community', data);
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
		errors.print(e, 'Error on server-side campaign.js/renderTeam: ');
	}
}

exports.community = function(req, res){
	try{
		var requestOptions, path, campaignName;
		// Make sure we are using the correct subdomain
		campaignName =  req.params.campaignName;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/campaigns/' + campaignName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderCommunity(req, res, body);
	   	});
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

var renderTransactions = function(req, res, responseBody, transactions){
	try{
		var data;

		if(responseBody[0]){
			// Need to render crowdsale dates properly
			data = responseBody[0];

			data.transactions = [];

			for(var i = 0; i < transactions.length ; i++){
				if(transactions[i].campaign_id == data.domain){
					data.transactions.push(transactions[i]);
				}
			}
			
			res.render('ico_dashboard/transactions', data);
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
		errors.print(e, 'Error on server-side campaign.js/renderTeam: ');
	}
}


exports.transactions = function(req, res){
	try{

		var user = req.user;
		var transactions = user.transactions;

		var requestOptions, path, campaignName;
		// Make sure we are using the correct subdomain
		campaignName =  req.params.campaignName;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/campaigns/' + campaignName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderTransactions(req, res, body, transactions);
	   	});
		
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

function renderHowTo(req, res, responseBody){
	try{
		var data;

		if(responseBody[0]){
			// Need to render crowdsale dates properly
			data = responseBody[0];
			
			res.render('ico_dashboard/how-to', data);
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
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
	
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
}

exports.how_to = function(req, res){
	var user = req.user;

	var requestOptions, path, campaignName;
	// Make sure we are using the correct subdomain
	campaignName =  req.params.campaignName;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/campaigns/' + campaignName;
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {
  			user: req.user
  		}
	};

   	request( requestOptions, function(err, response, body) {
      	renderHowTo(req, res, body);
   	});
};