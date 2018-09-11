'use strict';

const Web3 = require('web3');
const rinkeby_ws = 'wss://rinkeby.infura.io/_ws';
var provider = new Web3.providers.WebsocketProvider(rinkeby_ws);
var web3 = new Web3(provider);

provider.on('error', e => console.log('Error on API websocket ws.js: ', e));
provider.on('end', e => {
	console.log('WS closed');
	console.log('Attempting ws reconnect...');
	provider = new Web3.providers.WebsocketProvider(rinkeby_ws);

	provider.on('connect', function() {
		console.log('WS reconnected');
	});

	web3.setProvider(provider);
});	

const contract = require('truffle-contract');
const cron = require('node-cron');

// Import our contract artifacts and turn them into usable abstractions.
const sale_artifact = require('../../build/contracts/Crowdsale.json');

// MetaCoin is our usable abstraction, which we'll use through the code below.
const Sale = contract(sale_artifact);
const abi = Sale._json.abi;

// const address = Sale.networks[1].address;
const address = '0x120d189fb6062456da347be434d09bce8bb9bd25';
const instance = new web3.eth.Contract(abi, address);

var subscription_pending;
var subscription_logs;
var transaction_summary = 0;

var pendingTX;
var cronjob;

module.exports.start = function() {
	try {
		// Get the past log events from the contract
		instance.getPastEvents(
		    "TokenPurchase",
		    { fromBlock: 0, toBlock: "latest" },
		    (errors, events) => {
		        if (!errors) {
		            transaction_summary = events.length;
		            console.log('Token purchases = ' + transaction_summary);
		            subscribe_pending();
		            subscribe_logs();
		        }
		    }
		);

		// SIGUSR2 is the signal emitted by nodemon when the server restarts automatically
		process.once('SIGUSR2', function () {
			// Call function with additional callback function as it is asynchronous
			gracefulShutdown(function () {
				process.kill(process.pid, 'SIGUSR2');
		 	});
		});

		// SIGINT is the signal emitted by node.js when the server shuts down
		process.on('SIGINT', function () {
			gracefulShutdown(function () {
				process.exit(0);
		 	});
		});

		// SIGTERM is the signal emitted by heroku when the server shuts down
		process.on('SIGTERM', function() {
			gracefulShutdown(function () {
				process.exit(0);
			});
		});
	} catch(e) {
		console.log('Error on API websocket ws.js/start: ' + e);
	}
};

// Subscribe to the transactions added to the new block that relate to the contract address
var subscribe_logs = function(){
	try{
		console.log('Logs subscription started');
		subscription_logs = web3.eth.subscribe("logs", {}, function (error, result) {
		})
	        .on("data", function (_transaction) {
			    	web3.eth.getTransaction(_transaction.transactionHash)
			            .then(function (transaction) {
			            	if(transaction.to === null){} else {
				            	if(transaction.to.toLowerCase() === address){
				             		var gas = transaction.gas;

				             		web3.eth.getTransactionReceipt(transaction.hash)
			            				.then(function (transaction) {
			            					var gasUsed = transaction.gasUsed;

			            					if(gas > gasUsed){
			            						if(transaction.status === null){} else {
				            						console.log('TX SUCCEEDED = ' + transaction.status);
				            						stopCron();
				            					}
			            					}
			            				});
				             		// This will fire multiple times and may be the same thing each time
				             		// Upon recieving one of these, remove the pending TX and add the new TX to the actual TX collection in the DB
				             		// We can then query the transactions to show who has bought what/if the TX failed or not etc. 
				             		// We should then update the TX to the DB if the status has changed i.e. from pass to fail. 
				             		// INFO INCLUDED:
				             		// BlockHash/BlockNumber/Sent from/ Sent to/ gas used/ gasPrice / hash / input / nonce / tx index / tx value (eth) / v - r - s for signing
				             		// You can tell is the TX has failed by: 
				             		// Getting the TX receipt and checking certain details such as:
				             		// If the gas used was equal to gas sent
				             		// If the debug.transaction receipt returns no errors. 
		                		}
		                	}
			            });
	            })
	        .on("changed", function (_transaction) {
			        web3.eth.getTransaction(_transaction.transactionHash)
			            .then(function (transaction) {
			            	if(transaction.to === null){} else {
				            	if(transaction.to.toLowerCase() === address){
				             		console.log('REMOVED = ' + JSON.stringify(transaction));
				             		stopCron();
				             		// This will fire when the TX has been removed from the blockchain due to failing the compilation 
				             		
		                		}
		                	}
			            });
	            })
	       	.on("error", function (error) {
	       			console.log('Subscription error = ' + error);
	        	})
	} catch(e) {
		console.log('Error on API websocket ws.js/subscription_logs: ' + e);
	}
};

// Subscribe to any pending transactions added to the network that relate to the contract address
var subscribe_pending = function(){
	try{
		console.log('Pending subscription started');
		subscription_pending = web3.eth.subscribe('pendingTransactions', function (error, result) {
		})
	        .on("data", function (transactionHash) {
	            web3.eth.getTransaction(transactionHash)
	                .then(function (transaction) {
	                	if(transaction.to === null){} else {
		                	if(transaction.to.toLowerCase() === address){
		                    	console.log('PENDING = ' + JSON.stringify(transaction));

		                    	pendingTX = transaction.hash;

		                    	runCron(pendingTX);
		                    	// This should only fire once, we should immediately store the TX in the pending DB collection
		                    	// This will be able to show users if their TX is currently pending
		                	}
		                }
	                });
	        });
	} catch(e) {
		console.log('Error on API websocket ws.js/subscription_pending: ' + e);
	}
}

var runCron = function(txHash){
	try{
		// Check the blockchain every 10 seconds to see what happened to the pending TX
		cronjob = cron.schedule("*/10 * * * * *", function() {
			web3.eth.getTransactionReceipt(txHash)
	                .then(function (transaction) {
	                	if(transaction.status === null){} else {
		                	if(transaction.status === false){
		                		console.log('TX FAILED!');
		                		stopCron();
		                	}
		                }
	                })
	    });
	} catch(e) {
		console.log('Error on API websocket ws.js/runCron: ' + e);
	}
}

var stopCron = function(){
	try{
		console.log('stopping cron');
		cronjob.stop();
	} catch(e) {
		console.log('Error on API websocket ws.js/stopCron: ' + e);
	}
}

// Graceful shutdown is necessary to shutdown redundant DB connections after the server shuts down/restarts
var gracefulShutdown = function (callback) {
	try{
	    console.log("Disconnected from INFURA websocket...")
	    // unsubscribes the subscription
	    subscription_logs.unsubscribe(function (error, success) {
	        if (success){
	            console.log('Successfully unsubscribed!');
	        }
	        callback();
		});
	} catch(e) {
		console.log('Error on API websocket ws.js/gracefulShutdown: ' + e);
	}
};


