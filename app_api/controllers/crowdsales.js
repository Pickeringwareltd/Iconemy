var mongoose = require('mongoose');
var Proj = mongoose.model('Project');

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.crowdsalesCreate = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.crowdsalesReadOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.crowdsalesUpdateOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.crowdsalesDeleteOne = function (req, res) { 
	sendJsonResponse(res, 200, {"status" : "success"});
};