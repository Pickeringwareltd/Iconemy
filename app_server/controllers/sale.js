var express = require('express');
var request = require('request');
var WAValidator = require('wallet-address-validator');
var tracking = require('../../tracking/tracking');
var moment = require('moment');
moment().format();

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
}

var renderSale = function(req, res, responseBody) {

	if(!responseBody.message){

		console.log(JSON.stringify(responseBody));

		// Render date so timer can understand
		var endDate = responseBody.crowdsale.end;
		responseBody.crowdsale.end = renderDate(endDate);

		var startDate = responseBody.crowdsale.start;
		responseBody.crowdsale.start = renderDate(startDate);

		tracking.crowdsaleview(req, res, responseBody.project.id, responseBody.crowdsale.index);

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
	var message;

	if(!responseBody.message){
		if(req.query.err){
			if(req.query.err == 'nodata'){
				message = 'All fields marked with * are required!';
			} else if(req.query.err == 'invalidaddress'){
				message = 'Please provide a valid eth address';
			} else {
				message = 'Oops! Something has gone wrong!';
			}
		}
		res.render('create_sale', { 
			title: 'Create sale',
			token : {
				name: responseBody.token.name,
				symbol: responseBody.token.symbol
			},
			message: message
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

  	var access_token = req.session.passport.user.tokens.access_token;

  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {},
  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
	};

	request( requestOptions, function(err, response, data) {
		renderCreateSale(req, res, data);
   	});
};

var formatTime = function(_time){
	var index = _time.indexOf(':');
	var length = _time.length;
	var minutes = _time.substring(index + 1,length);

	if(_time.search('pm') > 0){

		// If the time is PM, simply add 12 to the hours
		// I.e. 10:00 pm = 22:00 pm
  		var hours = _time.substring(0,index);

  		if(hours != '12'){
  			hours = parseInt(hours) + 12;
  			hours = hours.toString();
  			_time = hours.concat(':', minutes);
  		}

  	} else if(_time.search('12') >= 0){
  		// if the time contains 12... AM then change the 12 to 00
  		// I.e. 12:15 am = 00:15 am
  		var hours = '00';
  		_time = hours.concat(':', minutes);

  	}

  	// Take off AM/PM
  	_time = _time.slice(0, -2);

  	return _time;
}

var formatData = function(req){
	var duration = req.body.sale_duration;

	// Find where the split between dates are
  	var index = duration.indexOf(' - ');
  	var length = duration.length;

  	// Split the dates
  	var start_date = duration.substring(0,index);
  	var end_date = duration.substring(index + 3, length);

  	// Format the times to 24 hours
  	var start_time = formatTime(req.body.start_time);
  	var end_time = formatTime(req.body.end_time);

  	// Join date and time together for formtatting
  	var start_datetime = start_date.concat(' ', start_time);
  	var end_datetime = end_date.concat(' ', end_time);

  	// Convert string to JS Date object
  	var start = moment(start_datetime, 'DD-MM-YYYY HH:mm').utc().format();
  	var end = moment(end_datetime, 'DD-MM-YYYY HH:mm').utc().format();

  	var isPublic = true;

  	if(req.body.sale_type == 'pre-sale'){
  		isPublic = false;
  	}

  	postdata = { 
    	name: req.body.sale_name,
    	start: start,
    	end: end,
    	status: 'Not started',
    	initialprice: parseFloat(req.body.token_price),
    	pricingmechanism: 'linear',
    	public: isPublic,
    	commission: parseInt(req.body.commission),
    	admin: req.body.admin_wallet,
		beneficiary: req.body.beneficiary_wallet,
    	createdBy: req.session.passport.user.user.id,
    	discount: req.body.discount
	};

	return postdata;
}

exports.doCreation = function(req, res){
	var requestOptions, path, projectname, postdata;
  	
  	projectname = req.params.projectname;
  	
  	path = "/api/projects/" + projectname + '/crowdsales';

  	var postdata = formatData(req);

  	var access_token = req.session.passport.user.tokens.access_token;

  	requestOptions = {
  		url : apiOptions.server + path,
  		method : "POST",
  		json : postdata,
  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
	}; 

	// Check the fields are present
	if (!postdata.name || !postdata.start || !postdata.end || !postdata.initialprice || postdata.public == undefined || !postdata.commission) {
  		res.redirect('/projects/' + projectname + '/crowdsales/create?err=nodata');
	} else if(!WAValidator.validate(postdata.admin, 'ETH') || !WAValidator.validate(postdata.beneficiary, 'ETH')){
  		res.redirect('/projects/' + projectname + '/crowdsales/create?err=invalidaddress');
	} else {

		request( requestOptions, function(err, response, body) {

		    if (response.statusCode === 201) {
		        res.redirect('/pay?project=' + projectname + '&item=crowdsale&id=' + body.index);
		    } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
				res.redirect('/projects/' + projectname + '/crowdsales/create?err=val');
		    } else {
		        res.render('error', { 
					message: body.message,
					error: {
						status: 404
					}
				});
			} 
		});

	}
};