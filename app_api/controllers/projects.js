var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var validateProject = function(data){
  var error;

  // If any required fields are missing, return appropriate error message 
  if (!data.name || !data.description || data.description == 'Enter a basic description about your project here' || !data.website || !data.subdomain || data.subdomain == '    .iconemy.io') {
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
  if(!data.subdomain.match(/^[a-z0-9]{0,63}$/)){
    error = 'Your subdomain can only include lowercase characters and numbers';
  	return error;
  }

  // All useful regexs come from https://github.com/lorey/social-media-profiles-regexs
  if(data.facebook != ''){
  	if(!data.facebook.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Facebook URL';
  		return error;
   	}
  }

  if(data.twitter != '') {
  	if(!data.twitter.match(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Twitter URL';
  		return error;
    }
  }

  if(data.youtube != ''){
  	if(!data.youtube.match(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Youtube URL';
  		return error;
    }
  }

  if(data.medium != ''){
  	if(!data.medium.match(/^(https?:\/\/)?(www\.)?medium.com\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Medium URL';
  		return error;	
    }
  }

  if(data.bitcointalk != ''){
  	if(!data.bitcointalk.match(/^(https?:\/\/)?(www\.)?bitcointalk.org\/[a-zA-Z0-9(\.\?)?]/)){
    	error = 'Must enter a valid Bitcointalk URL';
    	return error;
    }
  }

  if(data.telegram != ''){
  	if(!data.telegram.match(/https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-z0-9\_]{5,32})\/?/)){
    	error = 'Must enter a valid Telegram URL';
    	return error;
    }
  }

  return error;
}

module.exports.projectsCreate = function (req, res) { 

	Project
	    .find({subdomain: req.body.subdomain})
	    .exec(function(err, project) {
	         	// Create project creates a new document in the database if the JSON object passes validation in the schema
				Project
					.create({
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
					}, function(err, project) {
						// Callback is used to report an error or return project on successful save
			    		if (err) {
			      			sendJsonResponse(res, 400, err);
			    		} else {
			      			sendJsonResponse(res, 201, project);
			    		}
					}); 
	    });
};

module.exports.projectsListByStartTime = function (req, res) { 

	// Get all projects and sort by the date created in descending order (newest first)
	Project
		.find()
		.sort('-created')
		.exec(function(err, projects) {
			// If no project is found, return custom error message
	      	if (!projects) {
	          	sendJsonResponse(res, 404, { "message": "projects not found" });
	          	// MUST RETURN ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
	          	return;
	          	// If an error was returned, return that message
	        } else if (err) {
	         	sendJsonResponse(res, 404, err);
	          	return;
	      	} else {
	      		// If project was found and no error returned then return the project
	      		sendJsonResponse(res, 200, projects);
	      	}
		});
};

module.exports.projectsReadOne = function (req, res) { 

	// If the request parameters contains a project ID, then execute a query finding the object containing that id
	if (req.params && req.params.projectid) {
		// Call the Project model function to find the ID passed as a request parameter in the URL
		// I.e. api/projects/123
		// Execute the query and return a JSON response including the project found or an error
		Project
	    	.find({subdomain: req.params.projectid})
	    	.exec(function(err, project) {
	    		// If no project is found, return custom error message
	      		if (!project || project == '') {
	          		sendJsonResponse(res, 404, { "message": "projectID not found" });
	          		// MUST RETURN AFTER ERROR MESSAGES IN IF STATEMENTS TO PREVENT FURTHER EXECUTION OF FUNCTION
	          		return;
	          		// If an error was returned, return that message
	          	} else if (err) {
	          		sendJsonResponse(res, 404, err);
	          		return;
	      		} else {
	      			// If project was found and no error returned then return the project
	      			sendJsonResponse(res, 200, project);
	      		}
	    	});
	   } else {
	   		// Else if no projectID was specified in the request, return custom error message
	   		sendJsonResponse(res, 404, { "message": "No projectID in request" });
	   }

};

// You should only be able to update the common project details NOT INCLUDING subdomain as users will no longer be able to 
// find the project.
module.exports.projectssUpdateOne = function (req, res) { 
	var projectid = req.params.projectid;

	if(projectid) {
		Project
			.find({subdomain: req.params.projectid})
			.exec( function(err, project) {
				if (!project) {
				    sendJsonResponse(res, 404, { "message": "Project ID not found" });
				    return;
				} else if (err) {
				    sendJsonResponse(res, 400, err);
					return; 
				} else if (project.subdomain !== req.body.subdomain && project.token){
					// Should reject changes to subdomain as this is how users find projects
				    sendJsonResponse(res, 404, { "message": "You cannot change your subdomain once you deploy smart contracts." });
					return;
				}
				
				// Upload information from correct values.
				project.name = req.body.name,
				project.description = req.body.description,
				project.website = req.body.website,
				project.subdomain = req.body.subdomain,
				project.logo = req.body.logo,
				project.created = Date.now(),
				project.createdBy = project.createdBy,
				project.social.facebook = req.body.facebook,
				project.social.twitter = req.body.twitter,
				project.social.youtube = req.body.youtube,
				project.social.github = req.body.github,
				project.social.bitcointalk = req.body.bitcointalk,
				project.social.medium = req.body.medium,
				project.onepager = req.body.onepager,
				project.whitepaper = req.body.whitepaper

				// Try to save the project, return any validation errors if necessary
				project.save( function(err, project) {
					if (err) {
					    sendJsonResponse(res, 404, err);
					} else {
					    sendJsonResponse(res, 200, project);
					}
				});
			});
	} else {
    	sendJsonResponse(res, 404, { "message": "No project ID" }); 
    	return;
	}

};

// You should only be able to delete projects that dont have tokens and/or crowdsales that have been published to a network
// as they cant be deleted
module.exports.projectsDeleteOne = function (req, res) { 
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
		            	sendJsonResponse(res, 404, err);
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
};