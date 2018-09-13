'use strict';

var express = require('express');
var request = require('request');
var tracking = require('../../tracking/tracking');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

var renderProject = function(req, res, responseBody, subdomain){
	try{
		var data;

		var isOwner = false;

		if(responseBody[0]){
			// Need to render crowdsale dates properly
			data = responseBody[0];
			data.usingSubdomain = subdomain;

			if(req.session.passport != undefined){
				if(req.session.passport.user.user.id === data.createdBy){
					isOwner = true;
				}
			} 	

			var active = -1;

			var i;
			for (i = 0; i < data.crowdsales.length; i++) { 

				// Check if any of the crowdsales are currently active
				if(Date.now() > Date.parse(data.crowdsales[i].start) && Date.now() < Date.parse(data.crowdsales[i].end)){
					active = i;
				}

				data.crowdsales[i].start = renderDate(data.crowdsales[i].start);
				data.crowdsales[i].end = renderDate(data.crowdsales[i].end);
			}

			tracking.projectview(req, res, data);

			res.render('project_interaction', { 
				title: responseBody.name,
				projectInfo: data,
				active: active,
				isOwner: isOwner
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
	} catch(e) {
		console.log('Error on server-side project.js/renderProject: ' + e);
	}
}

var renderDate =  function(_date) {
	try{
		var date = new Date(_date);
		var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		var d = date.getDate();
		var m = monthNames[date.getMonth()];
		var y = date.getFullYear();
		date = d + ' ' + m + ' ' + y;

		return date;
	} catch(e) {
		console.log('Error on server-side project.js/renderDate: ' + e);
	}
}

exports.index = function(req, res){
	try{
		var requestOptions, path, projectName, subdomain;

		// Make sure we are using the correct subdomain
		projectName =  req.params.projectname;
		subdomain = false;

		if(projectName === undefined){
			projectName = req.subdomains;
			subdomain = true;
		}

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/projects/' + projectName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderProject(req, res, body, subdomain);
	   	});
	} catch(e) {
		console.log('Error on server-side project.js/index: ' + e);
	}
};

// Renders the create token form
var renderCreateProject = function(req, res){
	try {
		var message;

		if(req.query.err){
			if(req.query.err === 'nodata'){
				message = 'All fields marked with * are required!';
			} else {
				message = 'Oops! Somethings gone wrong';
			}
		}

		// Render create project form with placeholders
		res.render('create_project', { 
			title: 'Create project',
			message: message
		});
	} catch(e) {
		console.log('Error on server-side project.js/renderCreateProject: ' + e);
	}
}

exports.create = function(req, res){
	// If not logged in
	renderCreateProject(req, res);
};

// Renders the create token form
var renderUpdateProject = function(req, res, _data){
	try{
		var data, message;

		if(req.query.err){
			if(req.query.err === 'nodata'){
				message = 'All fields marked with * are required!';
			} else {
				message = 'Oops! Somethings gone wrong';
			}
		}

		data = _data[0];

		res.render('update_project', { 
			title: 'Update project',
			project: data,
			message: message
		});
	} catch(e) {
		console.log('Error on server-side project.js/renderUpdateProject: ' + e);
	}
}

exports.update = function(req, res){
	try {
		var requestOptions, path, projectName, access_token;

		// If not logged in
		if(req.user === undefined){
			res.redirect('/login');
			return;
		}

		// Make sure we are using the correct subdomain
		projectName =  req.params.projectname;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/projects/' + projectName;
	  	access_token = req.session.passport.user.tokens.access_token;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {},
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderUpdateProject(req, res, body);
	   	});
	} catch(e) {
		console.log('Error on server-side project.js/update: ' + e);
	}
};

// Create project controller for dealing with POST requests containing actual new project data.
exports.doUpdate = function(req, res){
	try{
		var requestOptions, path, postdata, subdomain, access_token;

		postdata = getData(req);
	  	subdomain = postdata.subdomain;

	  	path = "/api/projects/" + subdomain;
	  	access_token = req.session.passport.user.tokens.access_token;

		requestOptions = {
	  		url : apiOptions.server + path,
	  		method : "PUT",
	  		json : postdata,
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		}; 

		var error = validateProject(postdata);

		// Check the fields are present
		if (error === 'All fields marked with * are required!') {
	  		res.redirect('/projects/' + subdomain + 'update?err=nodata');
		} else if(error != undefined) {
			res.render('update_project', { 
				title: 'Update project',
				project: postdata,
				message: error
			});
		} else {

			request( requestOptions, function(err, response, body) {
		        if (response.statusCode === 200) {
		        	res.redirect('/projects/' + subdomain);
		        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
		        	if(response.body.errors.website != undefined){
		        		res.render('update_project', {title: 'Update project', message: 'We already have a project with that website.'});
		        	} else {
						res.redirect('/projects/' + subdomain + 'update?err=val');
					}
		        } else if (response.statusCode === 400 && body.message) {
		        	res.render('update_project', { 
						title: 'Update project',
						message: body.message
					});
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
	} catch(e) {
		console.log('Error on server-side project.js/doUpdate: ' + e);
	}

};

var validateProject = function(postdata){
	try{
	  var error;

	  // If any required fields are missing, return appropriate error message 
	  if (!postdata.name || !postdata.description || postdata.description === 'Enter a basic description about your project here' || !postdata.website || !postdata.subdomain || postdata.subdomain === '    .iconemy.io') {
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
	  	if(postdata.facebook.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/) === null){
	    	error = 'Must enter a valid Facebook URL';
	  		return error;
	   	}
	  }

	  if(postdata.twitter != '') {
	  	if(postdata.twitter.match(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/) === null){
	    	error = 'Must enter a valid Twitter URL';
	  		return error;
	    }
	  }

	  if(postdata.youtube != ''){
	  	if(postdata.youtube.match(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/) === null){
	    	error = 'Must enter a valid Youtube URL';
	  		return error;
	    }
	  }

	  if(postdata.medium != ''){
	  	if(postdata.medium.match(/^(https?:\/\/)?(www\.)?medium.com\/@?[a-zA-Z0-9(\.\?)?]+/) === null){
	    	error = 'Must enter a valid Medium URL';
	  		return error;	
	    }
	  }

	  if(postdata.bitcointalk != ''){
	  	if(postdata.bitcointalk.match(/^(https?:\/\/)?(www\.)?bitcointalk.org\/[a-zA-Z0-9(\.\?)?]/) === null){
	    	error = 'Must enter a valid Bitcointalk URL';
	    	return error;
	    }
	  }

	  if(postdata.telegram != ''){
	  	if(postdata.telegram.match(/https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9\_]{5,32})\/?/) === null){
	    	error = 'Must enter a valid Telegram URL';
	    	return error;
	    }
	  }

	  return error;
	} catch(e) {
		console.log('Error on server-side project.js/validateProject: ' + e);
	}
};

var addHttps = function (url) {
	try {
		var first = url.substring(0, 8);

		if(first != 'https://' && first != ''){
			url = 'https://' + url;
		}

		return url;
	} catch(e) {
		console.log('Error on server-side project.js/addHttps: ' + e);
	}
};

var getData = function(req) {
	try {
		var subdomain = req.body.subdomain;
	  	var index = subdomain.search(' ');

	  	subdomain = subdomain.substring(0, index);

		var postdata = {
			name: req.body.sale_name,
			description: req.body.description,
			website: req.body.website,
			subdomain: subdomain,
			logo: req.body.logo,
			createdBy: req.session.passport.user.user.id,
			facebook: addHttps(req.body.facebook),
			twitter: addHttps(req.body.twitter),
			youtube: addHttps(req.body.youtube),
			telegram: addHttps(req.body.telegram),
			bitcointalk: addHttps(req.body.bitcoin),
			medium: addHttps(req.body.medium),
			onepager: req.body.onepager,
			whitepaper: req.body.whitepaper
		};

		return postdata;
	} catch(e) {
		console.log('Error on server-side project.js/getData: ' + e);
	}
}

// Create project controller for dealing with POST requests containing actual new project data.
exports.doCreation = function(req, res){
	try{
		var requestOptions, path, postdata, subdomain, access_token;

	  	path = "/api/projects/create";
	  	
	  	postdata = getData(req);
	  	subdomain = postdata.subdomain;
	  	access_token = req.session.passport.user.tokens.access_token;

		requestOptions = {
	  		url : apiOptions.server + path,
	  		method : "POST",
	  		json : postdata,
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
		}; 

		var error = validateProject(postdata);

		// Check the fields are present
		if (error === 'All fields marked with * are required!') {
	  		res.redirect('/projects/create?err=nodata');
		} else if(error != undefined) {
			res.render('create_project', { 
				title: 'Create project',
				message: error
			});
		} else {

			request( requestOptions, function(err, response, body) {
		        if (response.statusCode === 201) {
		        	res.redirect('/projects/' + subdomain);
		        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
		        	if(response.body.errors.website != undefined){
		        		res.render('create_project', {title: 'Create project', message: 'We already have a project with that website.'});
		        	} else {
						res.redirect('/projects/create?err=val');
					}
		        } else if (response.statusCode === 400 && body.message) {
		        	res.render('create_project', { 
						title: 'Create project',
						message: body.message
					});
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
	} catch (e) {
		console.log('Error on server-side project.js/doCreation: ' + e);
	}

};

var renderMyProjects = function(req, res, responseBody){
	try {
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
	} catch(e) {
		console.log('Error on server-side project.js/renderMyProjects: ' + e);
	}
};

exports.myprojects = function(req, res){
	try{
	  	var requestOptions, path, access_token;

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/projects';

	  	access_token = req.session.passport.user.tokens.access_token;

	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' },
	  		json : {
	  			user: req.user
	  		}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderMyProjects(req, res, body);
	   	});
	} catch(e) {
		console.log('Error on server-side project.js/myProjects: ' + e);
	}
};

var renderBuyNow = function(req, res, body){
	try{
		var data;

		if(body[0]){
			// Need to render crowdsale dates properly
			data = body[0];

			var active = -1;

			var i;
			for (i = 0; i < data.crowdsales.length; i++) { 

				// Check if any of the crowdsales are currently active
				if(Date.now() > Date.parse(data.crowdsales[i].start) && Date.now() < Date.parse(data.crowdsales[i].end)){
					active = i;
				}

				data.crowdsales[i].start = renderDate(data.crowdsales[i].start);
				data.crowdsales[i].end = renderDate(data.crowdsales[i].end);
			}

			if(active > -1){
				res.redirect('/projects/' + data.subdomain + '/crowdsales/' + active);
			} else {
				res.render('error', { 
					title: 'error',
					message: 'You cant buy this token at the moment!',
					error: {
						status: 404
					}
				});
			}

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
		console.log('Error on server-side project.js/renderBuyNow: ' + e);
	}
}

exports.buynow = function(req, res){
	try{
		var requestOptions, path, projectName, subdomain;

		// Make sure we are using the correct subdomain
		projectName =  req.params.projectname;
		subdomain = false;

		if(projectName === undefined){
			projectName = req.subdomains;
			subdomain = true;
		}

	  	// Split the path from the url so that we can call the correct server in development/production
	  	path = '/api/projects/' + projectName;
	  
	  	requestOptions = {
	  		url: apiOptions.server + path,
	  		method : "GET",
	  		json : {}
		};

	   	request( requestOptions, function(err, response, body) {
	      	renderBuyNow(req, res, body);
	   	});
	} catch(e) {
		console.log('Error on server-side project.js/buynow: ' + e);
	}
};