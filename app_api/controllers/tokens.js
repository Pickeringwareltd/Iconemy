var mongoose = require('mongoose');
var Proj = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.tokenCreate = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.tokenRead = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.tokenUpdate = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.tokenDelete = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};