'use strict';

const Web3 = require('web3');
const rinkeby_ws = 'wss://rinkeby.infura.io/_ws';
var provider = new Web3.providers.WebsocketProvider(rinkeby_ws);
var web3 = new Web3(provider);

provider.on('error', e => console.log('WS Error', e));
provider.on('end', e => {
	console.log('end');
	setNewProvider();
});	

var setNewProvider = function(){
	try{
		console.log('WS closed');

		console.log('Attempting ws reconnect...');
		provider = new Web3.providers.WebsocketProvider(rinkeby_ws);

		provider.on('connect', function() {
			console.log('WS reconnected');
		});

		web3.setProvider(provider);
	} catch(e) {
		console.log('Error on API controllers contracts.js/setNewProvider: ' + e);
	}
}

const Set = require("collections/set");

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
 
module.exports.basicSale = function (req, res) { 
	try{
		var data = JSON.parse(req.body.json);

		var address = data.address;
		var abi = data.abi;

		var instance = new web3.eth.Contract(abi, address);

		var transaction_summary;

		// Get the past log events from the contract
		instance.getPastEvents(
		    "TokenPurchase",
		    { fromBlock: 0, toBlock: "latest" },
		    (errors, events) => {
		        if (!errors) {
		            transaction_summary = events.length;
		            sendJsonResponse(res, 200, {'transactions': transaction_summary});
		        } else {
		        	setNewProvider();
		        	sendJsonResponse(res, 400, {'error' : errors});
		        }
		    }
		);
	} catch(e) {
		console.log('Error on API controllers contracts.js/basicSale: ' + e);
	}
};

// This does NOT account for accounts which have sent all of their tokens to other accounts
// I.e. I could recieve 1 token and send that 1 token to someone else - therefore having a balance of 0.
module.exports.tokenHolders = function (req, res) { 
	try{
		var data = JSON.parse(req.body.json);

		var address = data.address;
		var abi = data.abi;

		var instance = new web3.eth.Contract(abi, address);

		var transaction_summary;

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
		        	console.log(errors);
		        	sendJsonResponse(res, 400, {'error' : errors});
		        }
		    }
		);
	} catch(e) {
		console.log('Error on API controllers contracts.js/tokenHolders: ' + e);
	}
};

// Get total number of transfer events 
module.exports.tokenTransfers = function (req, res) { 
	try{
		var data = JSON.parse(req.body.json);

		var address = data.address;
		var abi = data.abi;

		var instance = new web3.eth.Contract(abi, address);

		var transaction_summary;

		// Get the past log events from the contract
		instance.getPastEvents(
		    "Transfer",
		    { fromBlock: 0, toBlock: "latest" },
		    (errors, events) => {
		        if (!errors) {
		            transaction_summary = events.length;
		            sendJsonResponse(res, 200, {'transactions': transaction_summary});
		        } else {
		        	console.log(errors);
		        	sendJsonResponse(res, 400, {'error' : errors});
		        }
		    }
		);
	} catch(e) {
		console.log('Error on API controllers contracts.js/tokenTransfers: ' + e);
	}
};