var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.projectsCreate = function (req, res) { 
	
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
				github: req.body.github,
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