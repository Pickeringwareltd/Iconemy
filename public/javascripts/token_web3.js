import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import kyc_artifact from '../../build/contracts/KYCCrowdsale.json'
import token_artifact from '../../build/contracts/PickToken.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Sale = contract(kyc_artifact);
var Token = contract(token_artifact);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var hasweb3;
var tokensSent;

window.App = {
  start: function() {
    var self = this;

    var currentProvider = new Web3.providers.HttpProvider("https://mainnet.infura.io/QTytc1nasqq4LxVKgSLn");
    const web3 = new Web3(currentProvider);

    // Bootstrap the MetaCoin abstraction for Use.
    Token.setProvider(web3.currentProvider);
    Sale.setProvider(web3.currentProvider);
    self.refreshBalance();
  },
  
  refreshBalance: function() {
    var self = this;
    var sale;

    Sale.deployed().then(function(instance) {

      sale = instance;
      return sale.tokensSent();

    }).then(function(sent) {

      tokensSent = sent; 
      tokensSent = parseInt(tokensSent);

      console.log(tokensSent);

    }).catch(function(e) {
      console.log(e);
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  }

  App.start();
});