'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Message = mongoose.model('Contact');
var Subscription = mongoose.model('Subscription');
var tracking = require('../../add-ons/tracking');
var WAValidator = require('wallet-address-validator');
const errors = require('../../add-ons/errors');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


module.exports.getSubscriptions = function(req, res){
	try {
		// Get all messages and sort by the date created in descending order (newest first)
		Subscription
			.find()
			.sort('-time')
			.exec(function(err, _subscriptions) {
				// If no project is found, return custom error message
		      	if (!_subscriptions) {
		          	sendJsonResponse(res, 404, { "message": "messages not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		         	sendJsonResponse(res, 404, err);
		          	return;
		      	} else {
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, _subscriptions);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getSubscriptions: ');
	}
};

module.exports.respondToMessage = function(req, res){
	try{
		// Get all projects and sort by the date created in descending order (newest first)
		Message
			.findById(req.params.messageid)
			.exec(function(err, _message) {
				var message = _message;

				// If no project is found, return custom error message
		      	if (!message) {
		          	sendJsonResponse(res, 404, { "message": "messages not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		         	sendJsonResponse(res, 404, err);
		          	return;
		      	}

		      	message.responded = true;

		      	// Try to save the project, return any validation errors if necessary
				message.save( function(err, project) {
					if (err) {
						errors.print(err, 'Error marking message as responded: ');
					    sendJsonResponse(res, 404, 'Error marking message as responded');
					} else {
					    sendJsonResponse(res, 200, message);
					}
				});
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/respondToMessage: ');
	}
};

module.exports.getMessages = function(req, res){
	try{
		// Get all messages and sort by the date created in descending order (newest first)
		Message
			.find()
			.sort('-time')
			.exec(function(err, _messages) {
				// If no project is found, return custom error message
		      	if (!_messages) {
		          	sendJsonResponse(res, 404, { "message": "messages not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		        	errors.print(err, 'Error getting messages: ');
		         	sendJsonResponse(res, 404, 'Error getting messages');
		          	return;
		      	} else {
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, _messages);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getMessages: ');
	}
};

module.exports.getTokenContract = function(req, res) {
	try{
		var subdomain = req.params.projectid;

		// Get all projects and sort by the date created in descending order (newest first)
		Project
			.find({subdomain: subdomain})
			.select('token')
			.exec(function(err, _object) {
				// If no project is found, return custom error message
		      	if (!_object) {
		          	sendJsonResponse(res, 404, { "message": "token not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		        	errors.print(err, 'Error getting token contract: ');
		         	sendJsonResponse(res, 404, 'Error getting token contract');
		          	return;
		      	} else {
		      		var object = _object[0];
		      		var token = object.token;
		      		var contract = token.contract;
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, contract);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getTokenContract: ');
	}
};

var getContractData = function(req){
	try{
		var data = {
			address: req.body.address,
		    abi: req.body.abi,
		    bytecode: req.body.bytecode,
		    network: req.body.network,
	    	jsFileURL: req.body.jsFileURL,
	    	compiler: req.body.compiler
		}

		return data;
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getContractData: ');
	}
}

var validateContract = function(data){
	try{
		var error;

		// If any required fields are missing, return appropriate error message 
		if (!data.address || !data.abi || !data.bytecode || !data.network || !data.jsFileURL || !data.compiler) {
		 error = 'All fields marked with * are required!';
		 return error;
		}

		if(!WAValidator.validate(data.address, 'ETH')){
		 error = 'ETH address is invalid!';
		 return error;
		}

		return error;
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/validateContract: ');
	}
}

module.exports.setTokenContract = function(req, res) {
	try{
		var projectid = req.params.projectid;

		var data = getContractData(req);

		var error = validateContract(data);

		if(error != undefined) {
			sendJsonResponse(res, 404, { "message": error });
			return;	
		}

		if(projectid) {
			Project
				.find({subdomain: req.params.projectid})
				.exec( function(err, _project) {
					var project = _project[0];

					if (!project) {
					    sendJsonResponse(res, 404, { "message": "Project ID not found" });
					    return;
					} else if (err) {
					    sendJsonResponse(res, 400, err);
						return; 
					}
					
					// Upload information from correct values.
					project.token.contract = {
						abi: data.abi,
						address: data.address,
						network: data.network,
						bytecode: data.bytecode,
						jsFileURL: data.jsFileURL,
						compiler: data.compiler
					};

					project.token.jsFileURL = data.jsFileURL;
					project.token.deployed = 'Done';

					// Try to save the project, return any validation errors if necessary
					project.save( function(err, project) {
						if (err) {
							errors.print(err, 'Error setting token contract: ');
						    sendJsonResponse(res, 404, 'Error setting token contract');
						} else {
						    sendJsonResponse(res, 200, project.token);
						}
					});
				});
		} else {
	    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
	    	return;
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/setTokenContract: ');
	}
};

module.exports.getCrowdsaleContract = function(req, res) {
	try{
		var subdomain = req.params.projectid;
		var crowdsaleid = req.params.crowdsaleid;

		// Get all projects and sort by the date created in descending order (newest first)
		Project
			.find({subdomain: subdomain})
			.select('crowdsales')
			.exec(function(err, _object) {
				// If no project is found, return custom error message
		      	if (!_object) {
		          	sendJsonResponse(res, 404, { "message": "token not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		        	errors.print(err, 'Error getting crowdsale contract: ');
		         	sendJsonResponse(res, 404, 'Error getting crowdsale contract');
		          	return;
		      	} else {
		      		var object = _object[0];
		      		var crowdsales = object.crowdsales;
		      		var crowdsale = crowdsales[crowdsaleid];
		      		var contract = crowdsale.contract;
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, contract);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getCrowdsaleContract: ');
	}
};

module.exports.setCrowdsaleContract = function(req, res) {
	try{
		var projectid = req.params.projectid;
		var crowdsaleid = req.params.crowdsaleid;

		var data = getContractData(req);
		var error = validateContract(data);

		if(error != undefined) {
			sendJsonResponse(res, 404, { "message": error });
			return;	
		}

		if(projectid) {
			Project
				.find({subdomain: req.params.projectid})
				.exec( function(err, _project) {
					var project = _project[0];

					if (!project) {
					    sendJsonResponse(res, 404, { "message": "Project ID not found" });
					    return;
					} else if (err) {
						errors.print(err, 'Error setting crowdsale contract: ');
					    sendJsonResponse(res, 400, 'Error setting crowdsale contract');
						return; 
					}
					
					// Upload information from correct values.
					project.crowdsales[crowdsaleid].contract = {
						abi: data.abi,
						address: data.address,
						network: data.network,
						bytecode: data.bytecode,
						jsFileURL: data.jsFileURL,
						compiler: data.compiler
					};

					project.crowdsales[crowdsaleid].jsFileURL = data.jsFileURL;
					project.crowdsales[crowdsaleid].deployed = 'Done';

					// Try to save the project, return any validation errors if necessary
					project.save( function(err, project) {
						if (err) {
							errors.print(err, 'Error saving contract data to crowdsale: ');
						    sendJsonResponse(res, 404, 'Error saving contract data to crowdsale');
						} else {
						    sendJsonResponse(res, 200, project.crowdsales[crowdsaleid]);
						}
					});
				});
		} else {
	    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
	    	return;
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/setCrowdsaleContract: ');
	}
};

var validateProject = function(data){
	try{
		  var error;

		  // If any required fields are missing, return appropriate error message 
		  if (!data.name || !data.description || data.description === 'Enter a basic description about your project here' || !data.website || !data.subdomain || data.subdomain === '    .iconemy.io') {
		  	error = 'All fields marked with * are required!';
		  	return error;
		  }

		  if(!data.website.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)){
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
		  if(data.subdomain.match(/^[a-z0-9]{0,63}$/) === null){
		    error = 'Your subdomain can only include lowercase characters and numbers';
		  	return error;
		  }

		  // All useful regexs come from https://github.com/lorey/social-media-profiles-regexs
		  if(data.social.facebook != ''){
		  	if(data.social.facebook.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/) === null){
		    	error = 'Must enter a valid Facebook URL';
		  		return error;
		   	}
		  }

		  if(data.social.twitter != '') {
		  	if(data.social.twitter.match(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/) === null){
		    	error = 'Must enter a valid Twitter URL';
		  		return error;
		    }
		  }

		  if(data.social.youtube != ''){
		  	if(data.social.youtube.match(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/) === null){
		    	error = 'Must enter a valid Youtube URL';
		  		return error;
		    }
		  }

		  if(data.social.medium != ''){
		  	if(data.social.medium.match(/^(https?:\/\/)?(www\.)?medium.com\/@?[a-zA-Z0-9(\.\?)?]+/) === null){
		    	error = 'Must enter a valid Medium URL';
		  		return error;	
		    }
		  }

		  if(data.social.bitcointalk != ''){
		  	if(data.social.bitcointalk.match(/^(https?:\/\/)?(www\.)?bitcointalk.org\/[a-zA-Z0-9(\.\?)?]/) === null){
		    	error = 'Must enter a valid Bitcointalk URL';
		    	return error;
		    }
		  }

		  if(data.social.telegram != ''){
		  	if(data.social.telegram.match(/https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9\_]{5,32})\/?/) === null){
		    	error = 'Must enter a valid Telegram URL';
		    	return error;
		    }
		  }

		  return error;
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/validateProject: ');
	}
}

var getData = function(req){
	try{
		var data = {
					name: req.body.name,
					description: req.body.description,
					website: req.body.website,
					subdomain: req.body.subdomain,
					logo: req.body.logo,
					created: Date.now(),
					createdBy: req.body.createdBy,
					social: {
						facebook: req.body.facebook,
						twitter: req.body.twitter,
						youtube: req.body.youtube,
						telegram: req.body.telegram,
						bitcointalk: req.body.bitcointalk,
						medium: req.body.medium
					},
					onepager: req.body.onepager,
					whitepaper: req.body.whitepaper
					};

		return data;
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/getData: ');
	}
}
 
module.exports.projectsListByCreationTime = function (req, res) { 
	try{
		// Get all projects and sort by the date created in descending order (newest first)
		Project
			.find()
			.sort('-created')
			.exec(function(err, projects) {
				// If no project is found, return custom error message
		      	if (!projects) {
		          	sendJsonResponse(res, 404, { "message": "projects not found" });
		          	return;
		          	// If an error was returned, return that message
		        } else if (err) {
		        	errors.print(err, 'Error getting projects by creation time: ');
		         	sendJsonResponse(res, 404, 'Error getting projects by creation time');
		          	return;
		      	} else {
		      		// If project was found and no error returned then return the project
		      		sendJsonResponse(res, 200, projects);
		      	}
			});
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/projectsListByCreationTime: ');
	}
};

// You should only be able to update the common project details NOT INCLUDING subdomain as users will no longer be able to 
// find the project.
module.exports.projectssUpdateOne = function (req, res) { 
	try{
		var projectid = req.params.projectid;

		var data = getData(req);
		var error = validateProject(data);

		if(error != undefined) {
			sendJsonResponse(res, 404, { "message": error });
			return;	
		}

		if(projectid) {
			Project
				.find({subdomain: req.params.projectid})
				.exec( function(err, _project) {
					var project = _project[0];

					if (!project) {
					    sendJsonResponse(res, 404, { "message": "Project ID not found" });
					    return;
					} else if (err) {
						errors.print(err, 'Error getting project to update: ');
					    sendJsonResponse(res, 400, 'Error getting project to update');
						return; 
					} else if (project.subdomain !== req.body.subdomain && project.token){
						// Should reject changes to subdomain as this is how users find projects
					    sendJsonResponse(res, 404, { "message": "You cannot change your subdomain once you deploy smart contracts." });
						return;
					}
					
					// Upload information from correct values.
					project.name = data.name,
					project.description = data.description,
					project.website = data.website,
					project.logo = data.logo,
					project.social.facebook = data.social.facebook,
					project.social.twitter = data.social.twitter,
					project.social.youtube = data.social.youtube,
					project.social.github = data.social.github,
					project.social.bitcointalk = data.social.bitcointalk,
					project.social.medium = data.social.medium,
					project.onepager = data.onepager,
					project.whitepaper = data.whitepaper

					// Try to save the project, return any validation errors if necessary
					project.save( function(err, project) {
						if (err) {
							errors.print(err, 'Error storing updated project: ');
						    sendJsonResponse(res, 404, 'Error storing updated project');
						} else {
						    sendJsonResponse(res, 200, project);
						}
					});
				});
		} else {
	    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
	    	return;
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/projectssUpdateOne: ');
	}
};

// You should only be able to delete projects that dont have tokens and/or crowdsales that have been published to a network
// as they cant be deleted
module.exports.projectsDeleteOne = function (req, res) { 
	try{
		var projectid = req.params.projectid;
	  	
	  	if (projectid) {
	    	Project
	     	.find({subdomain: req.params.projectid})
	      	.exec( function(err, project) {

	      		if(!project) {
					sendJsonResponse(res, 404, {"message" : "Project does not exist"});
					return;
	      		} else if(project.token) {
		            sendJsonResponse(res, 404, { "message": "You cannot delete a project that has already deployed a token as the smart contract has now been published to the network." });
	      		} else {
		      		Project.remove( function(err, project) {
		      			if (err) {
		      				errors.print(err, 'Error deleting project: ');
			            	sendJsonResponse(res, 404, 'Error deleting project');
							return; 	
						} else {
			          		sendJsonResponse(res, 204, null);
						}
			        });
	      		}
	      	});
		} else {
	    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
		}
	} catch(e) {
		errors.print(e, 'Error on API controllers admin.js/projectsDeleteOne: ');
	}
};