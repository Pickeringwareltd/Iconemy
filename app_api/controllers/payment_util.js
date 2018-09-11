'use strict';

const WAValidator = require('wallet-address-validator');
const bitcoin = require('bitcoinjs-lib');
const ethereum = require('ethereumjs-wallet');
const request = require('request');
const NodeRSA = require('node-rsa');
const pub_key = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmqtODyKufEl107h8w/wZo6rB7+rgZyZz6L7JZv7i4SFZ2gQEqkguRT7ychYeHEdOYvNW4fnWYAwWPyd5WZiaxDylByS+5CYnVD7dagzAu5uJDZ8rqzbF4mPgzZjwfrqMzXyLtecqz/HWtD18GkKM6dbssACWWHUYrkIp6x6iTIQ3dTE7SAK/eZXlLdAbkBsd2j74FrPyX8yxZjOS3qi23ls7t5IFHYVQfjg/S5zG5b+fQV+BjzCcyY+MNuCftVjQxx1NdOb6lqqx/IyadAz1plAiAIDVdbqVV3bSzQD4QogCYs7lEgh9nat1XKhNZnRdFdpsTjTT6/b+KxjFcdsttQIDAQAB-----END PUBLIC KEY-----';

// Generates a new Bitcoin wallet used for collecting payments
var generateBTCWallet =  function() {
	try{
	  const network = bitcoin.networks.bitcoin;
	  const pair = bitcoin.ECPair.makeRandom({ network });

	  return {
	    seed: pair.toWIF(),
	    address: pair.getAddress()
	  }
	} catch(e) {
		console.log('Error on API controllers payment_util.js/generateBTCWallet: ' + e);
	}
}

// Get the balance of an eth address using the etherscan api
var getBTCBalances = function(address, project, crowdsaleid, res, callback) {
	try{
		// Get balance of BTC wallet with atleast 6 confirmations
		var url = 'https://chain.so/api/v2/get_address_balance/BTC/' + address + '/6';
		var requestOptions;

		requestOptions = {
			url : url,
			method : "GET",
			json : {}
		}; 

		request( requestOptions, function(err, response, body) {
			var btc = parseInt(body.data.confirmed_balance);

			// Use appropriate params in callback depending on if its a token or a crowdsale (crowdsale will come with ID)
			if(crowdsaleid != null){
				callback(project, btc, crowdsaleid, res);
			} else {
				callback(project, btc, res);
			}
		});
	} catch(e) {
		console.log('Error on API controllers payment_util.js/getBTCBalances: ' + e);
	}
}

// Generates a new Ethereum wallet used for collecting payments
var generateETHWallet = function() {
	try{
	  const pair = ethereum.generate();

	  return {
	    seed: pair.getPrivateKeyString(),
	    address: pair.getAddressString()
	  }
	} catch(e) {
		console.log('Error on API controllers payment_util.js/generateETHWallet: ' + e);
	}
}

// Get the balance of an eth address using the etherscan api
var getEthBalances = function(address, project, crowdsaleid, res, callback) {
	try{
		var apiKey = '6KM91A9J1KW79X6F4QM7JMJAPFFG7V5YCP';
		var url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;
		var testurl = 'http://api-rinkeby.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;
		var requestOptions;


		requestOptions = {
			url : testurl,
			method : "GET",
			json : {}
		}; 

		request( requestOptions, function(err, response, body) {
			var wei = parseInt(body.result);
			var eth = parseFloat(wei / 1000000000000000000);

			// Use appropriate params in callback depending on if its a token or a crowdsale (crowdsale will come with ID)
			if(crowdsaleid != null){
				callback(project, eth, crowdsaleid, res);
			} else {
				callback(project, eth, res);
			}
		});
	} catch(e) {
		console.log('Error on API controllers payment_util.js/getEthBalances: ' + e);
	}
}

module.exports.createWallet = function(currency){
	try{
		var wallet;
		var address;
		var seed;

		// Declare RSA modules ready for use
		const key = new NodeRSA();
		// import the public key declared at the top of the file
		key.importKey(pub_key, 'pkcs8-public');

		if(currency === 'eth'){
			wallet = generateETHWallet();
		} else {
			wallet = generateBTCWallet();
		}

		const priv_key = wallet.seed;

		// Encrypt the wallet seed with RSA public key declared at top of file. 
		// These can be decrypted off the system at a later date when dealing with payments
		address = wallet.address;
		seed = key.encrypt(priv_key, 'base64');

		wallet.seed = seed;

		// Return wallet information to be stored in the DB
		return wallet;
	} catch(e) {
		console.log('Error on API controllers payment_util.js/createWallet: ' + e);
	}
};

module.exports.getBalance = function(address, project, crowdsaleid, res, callback){
	try{
		var balance = 0; 

		if(address.substring(0,2) === '0x'){
			balance = getEthBalances(address, project, crowdsaleid, res, callback);
		} else {
			balance = getBTCBalances(address, project, crowdsaleid, res, callback);
		}
	} catch(e) {
		console.log('Error on API controllers payment_util.js/getBalance: ' + e);
	}
};