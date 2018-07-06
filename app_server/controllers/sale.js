var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

var renderSale = function(req, res, responseBody) {
		console.log('response = ' + JSON.stringify(responseBody));
		// res.render('sale_interaction', { 
		// 	title: 'Token',
		// 	sale: responseBody.sale
		// });
		res.render('sale_interaction', { 
			title: 'Sale',
			sale: {
				name: 'Donut sale',
				symbol: 'DNT',
				logo: 'images/donut_logo.png',
				social: {
					facebook: 'https://www.facebook.com/donut',
					twitter: 'https://www.twitter.com/donut', 
					youtube: 'https://www.youtube.com/donut',
					github: 'https://www.github.com/donut',
					bitcointalk: 'https://www.bitcointalk.com/donut',
					medium: 'https://www.medium.com/donut' 
				}
			}
		});
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

exports.create = function(req, res){
	res.render('create_sale', { 
		title: 'Create sale',
		token : {
			name: 'Donut',
			symbol:'DNT'
		}
	});
};