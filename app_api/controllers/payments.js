var WAValidator = require('wallet-address-validator');
var bitcoin = require('bitcoinjs-lib');
var ethereum = require('ethereumjs-wallet');
var request = require('request');

// Generates a new Bitcoin wallet used for collecting payments
var generateBTCWallet =  function() {
  const network = bitcoin.networks.bitcoin;
  const pair = bitcoin.ECPair.makeRandom({ network });

  return {
    privateKey: pair.toWIF(),
    address: pair.getAddress()
  }
}

// Generates a new Ethereum wallet used for collecting payments
var generateETHWallet = function() {
  const pair = ethereum.generate();

  return {
    privateKey: pair.getPrivateKeyString(),
    address: pair.getAddressString()
  }
}

// Get the balance of an eth address using the etherscan api
var getEthBalances = async function(address) {
	var apiKey = '6KM91A9J1KW79X6F4QM7JMJAPFFG7V5YCP';
	var url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKey;

	requestOptions = {
		url : url,
		method : "GET",
		json : {}
	}; 

	request( requestOptions, function(err, response, body) {
		var wei = parseInt(body.result);
		var eth = parseFloat(wei / 1000000000000000000);

		return eth;
	});
}

module.exports.createWallet = function(currency){
	var address;

	if(currency == 'eth'){
		address = generateETHWallet();

		// Print out public/private key pairs
		console.log(address);
		address = address.address;
	} else {
		address = generateBTCWallet();

		// Print out public/private key pairs
		console.log(address);
		address = address.address;
	}

	return address;
};

module.exports.getBalance = function(address){
	var balance = 0; 

	if(address.substring(0,2) == '0x'){
		balance = getEthBalances(address);
	} 

	return balance;
};