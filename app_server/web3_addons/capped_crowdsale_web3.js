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

var setProviders = function() {
    // Bootstrap the MetaCoin abstraction for Use.
    Token.setProvider(web3.currentProvider);
    Sale.setProvider(web3.currentProvider);

    //dirty hack for web3@1.0.0 support for infura http provider, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof Sale.currentProvider.sendAsync !== "function") {
      Sale.currentProvider.sendAsync = function() {
        return Sale.currentProvider.send.apply(
          Sale.currentProvider,
              arguments
        );
      };
    }

    if (typeof Token.currentProvider.sendAsync !== "function") {
      Token.currentProvider.sendAsync = function() {
        return Token.currentProvider.send.apply(
          Token.currentProvider,
              arguments
        );
      };
    }
};

window.App = {
  start: function() {
    var self = this;

    try {
        // Get the initial account balance so it can be displayed.
        web3.eth.getAccounts(function(err, accs) {

          if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
          }

          hasweb3 = true;

          accounts = accs;
          account = accounts[0];
        });

        // Bootstrap the MetaCoin abstraction for Use.
        Token.setProvider(web3.currentProvider);
        Sale.setProvider(web3.currentProvider);

    } catch(err) {
      hasweb3 = false;
      var currentProvider = new Web3.providers.HttpProvider("https://mainnet.infura.io/QTytc1nasqq4LxVKgSLn");
      const web3 = new Web3(currentProvider);

      // Bootstrap the MetaCoin abstraction for Use.
      setProviders();
    }

    self.refreshBalance();
    self.getTotalSupply();
    self.getCanMint();
    self.getOwner();
  },
  
  refreshBalance: function() {
    var self = this;
    var sale;

    Sale.deployed().then(function(instance) {
      sale = instance;
      return sale.token();
    }).then(function(token) {
      var tokenAddress = token;
      var pickTokenInstance = Token.at(tokenAddress);
      return pickTokenInstance.balanceOf(account);
    }).then(function(balance) {
      var thisBalance = parseFloat(balance);
      thisBalance = convertJackToPick(thisBalance);

      $('#balance_num').html(thisBalance);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  getTotalSupply: function() {
    var self = this;
    var sale;

    Sale.deployed().then(function(instance) {
      sale = instance;
      return sale.token();
    }).then(function(token) {
      var tokenAddress = token;
      var pickTokenInstance = Token.at(tokenAddress);
      return pickTokenInstance.totalSupply();
    }).then(function(_supply) {
      var supply = parseFloat(_supply);
      supply = convertJackToPick(supply);

      supply = addCommas(supply);

      $('#supply_num').html(supply);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  getOwner: function() {
    var self = this;
    var sale;

    Sale.deployed().then(function(instance) {
      sale = instance;
      return sale.token();
    }).then(function(token) {
      var tokenAddress = token;
      var pickTokenInstance = Token.at(tokenAddress);
      return pickTokenInstance.owner();
    }).then(function(_owner) {

      // Only show admin sections if the owner of the contract matches the wallet currently logged in
      if(hasweb3){
        if(account != _owner){
          $('.admin_only').css('display', 'none');
        }
      } else {
          $('.admin_only').css('display', 'none');
      }

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  transferTokens: function() {
    var self = this;
    var sale;

    var to = $('#transfer_section #address').val();
    var amount =  parseFloat($('#transfer_section #tokens').val());

    if(hasweb3 && to && amount){
      Sale.deployed().then(function(instance) {
        sale = instance;
        return sale.token();
      }).then(function(token) {
        var tokenAddress = token;
        var pickTokenInstance = Token.at(tokenAddress);
        return pickTokenInstance.transfer(to, amount, {from: account, gasPrice: web3.utils.toWei('21', "gwei")});
      }).then(function(_txhash) {

      // Do something after successful transfer

      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });
    }
  },

  getCanMint: function() {
    var self = this;
    var sale;

    Sale.deployed().then(function(instance) {
      sale = instance;
      return sale.token();
    }).then(function(token) {
      var tokenAddress = token;
      var pickTokenInstance = Token.at(tokenAddress);
      return pickTokenInstance.mintingFinished();
    }).then(function(_finishedMinting) {
      var mintingFinished = _finishedMinting;

      if(mintingFinished){
        $('#minting_section .status_dot').css('background-color', '#FF0000');
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  mintTokens: function() {
    var self = this;
    var sale;

    var to = $('#minting_section #address').val();
    var amount =  parseFloat($('#minting_section #tokens').val());

    if(hasweb3 && to && amount){
      Sale.deployed().then(function(instance) {
        sale = instance;
        return sale.token();
      }).then(function(token) {
        var tokenAddress = token;
        var pickTokenInstance = Token.at(tokenAddress);
        return pickTokenInstance.mint(to, amount, {from: account, gasPrice: web3.utils.toWei('21', "gwei")});
      }).then(function(_txhash) {

      // Do something after successful transfer

      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });
    }
  },

  releaseTokens: function() {
    var self = this;
    var sale;

    if(hasweb3){
      Sale.deployed().then(function(instance) {
        sale = instance;
        return sale.token();
      }).then(function(token) {
        var tokenAddress = token;
        var pickTokenInstance = Token.at(tokenAddress);
        return pickTokenInstance.releaseTokenTransfer({from: account, gasPrice: web3.utils.toWei('21', "gwei")});
      }).then(function(_txhash) {

        // Do something after successful TX

      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error getting balance; see log.");
      });
    }
  }
};

// Adds commas to large numbers such as total supply
function addCommas(str) {
    var parts = (str + "").split("."),
        main = parts[0],
        len = main.length,
        output = "",
        first = main.charAt(0),
        i;

    if (first === '-') {
        main = main.slice(1);
        len = main.length;    
    } else {
        first = "";
    }
    i = len - 1;
    while(i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = "," + output;
        }
        --i;
    }
    // put sign back
    output = first + output;
    // put decimal part back
    if (parts.length > 1) {
        output += "." + parts[1];
    }
    return output;
}

function convertJackToPick(jack){
  var picks = 0;

  picks = jack / 100000;

  return picks;
}

$("#transfer_btn").click(function(){
  App.transferTokens();
});

$("#mint_btn").click(function(){
  App.mintTokens();
});

$("#release_btn").click(function(){
  App.releaseTokens();
});

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  }

  App.start();
});