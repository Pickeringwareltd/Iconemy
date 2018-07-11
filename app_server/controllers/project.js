var express = require('express');
var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://iconemy-start.herokuapp.com";
}

var renderProject = function(req, res, responseBody){

	if(responseBody[0]){
		// Need to render crowdsale dates properly
		data = responseBody[0];

		var i;
		for (i = 0; i < data.crowdsales.length; i++) { 
			data.crowdsales[i].start = renderDate(data.crowdsales[i].start);
			data.crowdsales[i].end = renderDate(data.crowdsales[i].end);
		}

		res.render('project_interaction', { 
			title: responseBody.name,
			projectInfo: data
		});
	} else {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
	}
}

var renderDate =  function(_date) {

	var date = new Date(_date);
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var d = date.getDate();
	var m = monthNames[date.getMonth()];
	var y = date.getFullYear();
	date = d + ' ' + m + ' ' + y;

	return date;
}

exports.index = function(req, res){
	var requestOptions, path;

	// Make sure we are using the correct subdomain
	var projectName =  req.params.projectname;

	if(projectName == undefined){
		projectName = req.subdomains;
	}

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects/' + projectName;
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderProject(req, res, body);
   	});
};

// Renders the create token form
var renderCreateProject = function(req, res){
	var message;

	if(req.query.err){
		if(req.query.err == 'nodata'){
			message = 'All fields marked with * are required!';
		} else {
			message = 'Oops! Somethings gone wrong';
		}
	}

	res.render('create_project', { 
		title: 'Create project',
		message: message
	});
}

exports.create = function(req, res){
	renderCreateProject(req, res);
};

var validateProject = function(postdata){
  var error;

  // If any required fields are missing, return appropriate error message 
  if (!postdata.name || !postdata.description || postdata.description == 'Enter a basic description about your project here' || !postdata.website || !postdata.subdomain || postdata.subdomain == '    .iconemy.io') {
  	error = 'All fields marked with * are required!';
  	return error;
  }

  if(!postdata.website.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)){
    error = 'Must enter a valid web address!';
  	return error;
  }

  /* 
   * There are various rules surrounding subdomains:
   * One sub-domain allowed
   * Subdomain begins with alpha-num.
   * Optionally more than one char.
   * Middle part may have dashes.
   * Starts and ends with alpha-num.
   * Subdomain length from 1 to 63.
   * See https://stackoverflow.com/questions/7930751/regexp-for-subdomain for more details.
  */
  if(!postdata.subdomain.match(/^[a-z0-9]{0,63}$/)){
    error = 'Your subdomain can only include lowercase characters and numbers';
  	return error;
  }

  // All useful regexs come from https://github.com/lorey/social-media-profiles-regexs
  if(postdata.facebook != ''){
  	if(!postdata.facebook.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Facebook URL';
  		return error;
   	}
  }

  if(postdata.twitter != '') {
  	if(!postdata.twitter.match(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Twitter URL';
  		return error;
    }
  }

  if(postdata.youtube != ''){
  	if(!postdata.youtube.match(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Youtube URL';
  		return error;
    }
  }

  if(postdata.medium != ''){
  	if(!postdata.medium.match(/^(https?:\/\/)?(www\.)?medium.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Medium URL';
  		return error;	
    }
  }

  if(postdata.bitcointalk != ''){
  	if(!postdata.bitcointalk.match(/^(https?:\/\/)?(www\.)?bitcointalk.org\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Bitcointalk URL';
    	return error;
    }
  }

  if(postdata.telegram != ''){
  	if(!postdata.telegram.match(/https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-z0-9\_]{5,32})\/?/)){
    	error = 'Must enter a valid Telegram URL';
    	return error;
    }
  }

  return error;
};

// Create project controller for dealing with POST requests containing actual new project data.
exports.doCreation = function(req, res){
	var requestOptions, path, projectname, postdata;

  	projectname = req.params.projectname;

  	path = "/api/projects/create";

  	var subdomain = req.body.subdomain;
  	var index = subdomain.search(' ');

  	subdomain = subdomain.substring(0, index);
  	
  	postdata = {
		name: req.body.sale_name,
		description: req.body.description,
		website: req.body.website,
		subdomain: subdomain,
		logo: 'images/donut_logo_large.png',
		createdBy: 'Jack',
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		youtube: req.body.youtube,
		telegram: req.body.telegram,
		bitcointalk: req.body.bitcoin,
		medium: req.body.medium,
		onepager: req.body.onepager,
		whitepaper: req.body.whitepaper
	};

	requestOptions = {
  		url : apiOptions.server + path,
  		method : "POST",
  		json : postdata
	}; 

	var error = validateProject(postdata);

	// Check the fields are present
	if (error == 'All fields marked with * are required!') {
  		res.redirect('/projects/create?err=nodata');
	} else if(error != '') {
		res.render('create_project', { 
			title: 'Create project',
			message: error
		});
	} else {

		request( requestOptions, function(err, response, body) {
	        if (response.statusCode === 201) {
	        	res.redirect('/projects/' + subdomain);
	        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
				res.redirect('/projects/create?err=val');
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

var renderMyProjects = function(req, res, responseBody){
	var message;

	// Return appropriate error message if necessary
	if (!(responseBody instanceof Array)) {
		message = "API lookup error, try refreshing the page'";
		responseBody = [];
	} else {
		if (!responseBody.length) {
	    	message = "No project found!";
		} 	
	}

	res.render('my_projects', { 
		title: 'My projects',
		crowdsales: responseBody,
		message: message
	});
};

exports.myprojects = function(req, res){
  	var requestOptions, path;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/projects';
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	};

   	request( requestOptions, function(err, response, body) {
      	renderMyProjects(req, res, body);
   	});
};