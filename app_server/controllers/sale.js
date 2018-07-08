var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

var renderSale = function(req, res, responseBody) {

	// Render date so timer can understand
	var endDate = responseBody.crowdsale.end;
	responseBody.crowdsale.end = renderDate(endDate);

	if(!responseBody.message){
		res.render('sale_interaction', { 
			title: 'Crowdsale',
			data: responseBody
		});
	} else {
		res.render('error', { 
			title: 'error',
			message: responseBody.message,
			error: {
				status: 404
			}
		});
	}
}

var renderDate =  function(_date) {

	var date = new Date(_date);
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	date = y + '/' + m + '/' + d;

	return date;
}

exports.index = function(req, res){
	var requestOptions, path;

	// Make sure we are using the correct subdomain
	var projectName =  req.params.projectname;
	var saleId = req.params.crowdsaleid;

	if(projectName == undefined){
		projectName = req.subdomains;
	}

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects/' + projectName + '/crowdsales/' + saleId;

  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderSale(req, res, body);
   	});
};

var renderCreateSale = function(req, res, responseBody) {

	console.log(responseBody);

	if(!responseBody.message){
		res.render('create_sale', { 
			title: 'Create sale',
			token : {
				name: responseBody.token.name,
				symbol: responseBody.token.symbol
			}
		});
	} else {
		res.render('error', { 
			title: 'error',
			message: responseBody.message,
			error: {
				status: 404
			}
		});
	}
}

exports.create = function(req, res){
	var requestOptions, path;

	// Make sure we are using the correct subdomain
	var projectName =  req.params.projectname;

	if(projectName == undefined){
		projectName = req.subdomains;
	}

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects/' + projectName + '/token';

  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

	request( requestOptions, function(err, response, data) {
		renderCreateSale(req, res, data);
   	});
};