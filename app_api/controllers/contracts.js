const Web3 = require('web3');
const web3 = new Web3('wss://rinkeby.infura.io/_ws');
const Set = require("collections/set");

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
 
module.exports.basicSale = function (req, res) { 
	var data = JSON.parse(req.body.json);

	var address = data.address;
	var abi = data.abi;

	var instance = new web3.eth.Contract(abi, address);

	// Get the past log events from the contract
	instance.getPastEvents(
	    "TokenPurchase",
	    { fromBlock: 0, toBlock: "latest" },
	    (errors, events) => {
	        if (!errors) {
	            transaction_summary = events.length;
	            sendJsonResponse(res, 200, {'transactions': transaction_summary});
	        } else {
	        	sendJsonResponse(res, 400, {'error' : errors});
	        }
	    }
	);
};

// This does NOT account for accounts which have sent all of their tokens to other accounts
// I.e. I could recieve 1 token and send that 1 token to someone else - therefore having a balance of 0.
module.exports.tokenHolders = function (req, res) { 
	var data = JSON.parse(req.body.json);

	var address = data.address;
	var abi = data.abi;

	var instance = new web3.eth.Contract(abi, address);

	// Get the past log events from the contract
	instance.getPastEvents(
	    "Transfer",
	    { fromBlock: 0, toBlock: "latest" },
	    (errors, events) => {
	        if (!errors) {
	            transaction_summary = events.length;
	            var token_holders = new Set([]);

	          	for(var i = 0 ; i < events.length ; i++){
	          		token_holders.add(events[i].returnValues.to);
	          	}

	            sendJsonResponse(res, 200, {'holders': token_holders.length});
	        } else {
	        	sendJsonResponse(res, 400, {'error' : errors});
	        }
	    }
	);
};

// Get total number of transfer events 
module.exports.tokenTransfers = function (req, res) { 
	var data = JSON.parse(req.body.json);

	var address = data.address;
	var abi = data.abi;

	var instance = new web3.eth.Contract(abi, address);

	// Get the past log events from the contract
	instance.getPastEvents(
	    "Transfer",
	    { fromBlock: 0, toBlock: "latest" },
	    (errors, events) => {
	        if (!errors) {
	            transaction_summary = events.length;
	            sendJsonResponse(res, 200, {'transactions': transaction_summary});
	        } else {
	        	sendJsonResponse(res, 400, {'error' : errors});
	        }
	    }
	);
};