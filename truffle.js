'use strict';

// Allows us to use ES6 in our migrations and tests.
require('babel-register');
var Web3 = require("web3")
var web3 = new Web3("https://mainnet.infura.io/QTytc1nasqq4LxVKgSLn")
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonicL = "zebra mistake reward flash fit slam early youth chimney diesel enjoy urge";
var mnemonic = "absurd champion gallery crouch fix floor spatial nation moral width bubble discover";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
    	provider: function() {
    		return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/QTytc1nasqq4LxVKgSLn")
    	},
    	network_id: 4,
      gasPrice: web3.toWei(0.000000005, 'ether'),  //5 Gwei
      gas: 5000000
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonicL, "https://mainnet.infura.io/QTytc1nasqq4LxVKgSLn")
      },
      network_id: 1,
      gasPrice: web3.toWei(0.000000005, 'ether'),  //5 Gwei
      gas: 5000000
    } 
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}



