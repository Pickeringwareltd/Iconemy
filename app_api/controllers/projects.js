var mongoose = require('mongoose');
var Proj = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.projectsCreate = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.projectsListByStartTime = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.projectsReadOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.projectssUpdateOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.projectsDeleteOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};