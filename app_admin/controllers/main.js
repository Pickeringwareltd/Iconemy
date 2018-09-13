'use strict';

var express = require('express');
var request = require('request');
var moment = require('moment');
var WAValidator = require('wallet-address-validator');
// https://github.com/catamphetamine/javascript-time-ago#readme
var time_ago = require('javascript-time-ago');
var en_locale = require('javascript-time-ago/locale/en');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

exports.messageResponded = function(req, res) {
  try{
      var requestOptions, path, access_token;

      // Split the path from the url so that we can call the correct server in development/production
      path = '/api/admin/messages/' + req.params.messageid + '/responded';
    
      access_token = req.session.passport.user.tokens.access_token;
    
      requestOptions = {
        url: apiOptions.server + path,
        method : "POST",
        json : {},
        headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
      };

      request( requestOptions, function(err, response, body) { 
          res.redirect('/admin');
      });
  } catch(e) {
    console.log('Error on admin controllers main.js/messageResponded: ' + e);
  }
};

exports.index = function(req, res){
  try{
      var requestOptions, path, access_token;

      // Split the path from the url so that we can call the correct server in development/production
      path = '/api/admin/messages';
      access_token = req.session.passport.user.tokens.access_token;
    
      requestOptions = {
        url: apiOptions.server + path,
        method : "GET",
        json : {},
        headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
      };

      request( requestOptions, function(err, response, body) { 
          renderPortal(req, res, body);
      });
  } catch(e) {
    console.log('Error on admin controllers main.js/index: ' + e);
  } 
};

var renderPortal = function(req, res, message_data){
  try{

    var requestOptions, path, access_token;

    // Split the path from the url so that we can call the correct server in development/production
    path = '/api/admin/subscriptions';
    access_token = req.session.passport.user.tokens.access_token;
    
    requestOptions = {
        url: apiOptions.server + path,
        method : "GET",
        json : {},
        headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
    };

    request( requestOptions, function(err, response, subscribe_data) { 

        // Set the locale (english time) for time_ago
        time_ago.locale(en_locale);
        const timeAgo = new time_ago('en-US');

        var no_reply = 0;

        for(var i = 0 ; i < message_data.length ; i++){
          if(message_data[i].responded === false){
            no_reply++;
          }

          message_data[i].time = timeAgo.format(new Date(message_data[i].time), 'twitter');
        }

        var todays_subscribers = 0;
        var todaysDate = new Date();

        // Loop through the subscribers and check if they subscribed today, then convert their time to 'time ago'
        for(var j = 0 ; j < subscribe_data.length ; j++){
          // Create date from input value
          var inputDate = new Date(subscribe_data[j].time);

          // call setHours to take the time out of the comparison
          if(inputDate.setHours(0,0,0,0) === todaysDate.setHours(0,0,0,0)) {
              todays_subscribers++;
          }

          // Format the date to 'time ago...'
          subscribe_data[j].time = timeAgo.format(new Date(subscribe_data[j].time), 'twitter');

          // If theres no time ago, it means its been less than a minute since the time
          if(subscribe_data[j].time === ''){
            subscribe_data[j].time = 'Just now';
          }
        }

        var data = {
          unread: no_reply,
          messages: message_data,
          subscriptions: subscribe_data,
          subscribed_today: todays_subscribers
        }

        res.render('admin_portal', data);

    }); 
  } catch(e) {
    console.log('Error on admin controllers main.js/renderPortal: ' + e);
  }
};

exports.projects = function(req, res){
  try{
  	 var requestOptions, path, access_token;

    	// Split the path from the url so that we can call the correct server in development/production
    	path = '/api/admin/projects';
      access_token = req.session.passport.user.tokens.access_token;
    
      requestOptions = {
        url: apiOptions.server + path,
        method : "GET",
        json : {},
        headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
      };

     	request( requestOptions, function(err, response, body) { 
        	renderProjects(req, res, body);
     	});
  } catch(e) {
    console.log('Error on admin controllers main.js/projects: ' + e);
  }
};

var renderProjects = function(req, res, body){
  try{
    var data = body;
    var projects = [];

    // Call the pricing URL to get accurate information on USD -> BTC/ETH prices
    var price_url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH';

    var requestOptions = {
      url : price_url,
      method : "GET",
      json : {}
    }; 

    // Get the BTC and ETH prices on the dollar so we can convert to work out total revenue
    request( requestOptions, function(err, response, body) {

        if(err){
            sendJsonResponse(res, 404, err);
            return;
        }

        // Convert price of ETH to $ such that 1 eth = $X
        var eth = body.ETH;
        eth = 1 / eth;
        // Convert price of BTC to $ such that 1 btc = $X
        var btc = body.BTC;
        btc = 1 / btc;

        // Now we loop through each project and build an object for each one:
        // Created (format date), Subdomain, Website, Status (anything needs deploying/project/token/sale/active), revenue
        for(var i = 0; i < data.length; i++){
            var created = data[i].created;
            var subdomain = data[i].subdomain;
            var website = data[i].website;
            var time = moment(created).format('DD/MM/YYYY - HH:mm:ss');

            var token_status = getTokenStatus(data[i]);
            var sale_status = getSaleStatus(data[i]);

            var revenue = getRevenue(data[i], eth, btc);
            revenue = '$' + revenue;

            projects[i] = {
              created: time,
              subdomain: subdomain,
              website: website, 
              token_status: token_status,
              sale_status: sale_status,
              revenue: revenue
            }
        }

        data = {
          projects: projects
        }

        res.render('admin_all_projects', data);
    });
  } catch(e) {
    console.log('Error on admin controllers main.js/renderProjects: ' + e);
  } 
};

// Get status by looping through the project
// Check if it has a token - if not status = PROJECT
// If has token but hasnt paid yet = paying token
// If has token and has paid but not deployed = deploying token
// If has token and is deployed but no sales = TOKEN
// If sale that starts closest to now has not been paid = paying sale
// If sale that has paid but hasnt deployed = deploying sale
// If sale closest to now is deployed = SALE
// If there is a sale currently active = ACTIVE
var getTokenStatus = function(_project){
  try{
      var project = _project;
      var status = {
        message: 'none',
        color: '#A2A2A2'
      }

      if(project.token){
        status.message = 'needs payment';
        status.color = '#F09300';
        if(project.token.discount_code === 'GIVEMEITFREE' || typeof project.token.payment !== "undefined"){
          status.message = 'needs deploying';
          status.color = '#0007FF';
          if(project.token.deployed === 'Done'){
            status.message = 'deployed';
            status.color = '#27CB00';
          } 
        }
      }

      return status;
  } catch(e) {
    console.log('Error on admin controllers main.js/getTokenStatus: ' + e);
  } 
};

var getSaleStatus = function(_project){
  try{
      var project = _project;
      var status = {
        message: 'none',
        color: '#A2A2A2'
      }

      if(project.crowdsales.length > 0){
        status.message = 'needs payment';
        status.color = '#F09300';
        for(var i = 0; i < project.crowdsales.length; i++){
          if(project.crowdsales[i].payment){
            if(typeof project.crowdsales[i].payment.paid !== "undefined" || project.crowdsales[i].discount_code === 'GIVEMEITFREE'){
              status.message = 'needs deploying';
              status.color = '#0007FF';

                if(project.crowdsales[i].deployed === 'Done'){
                  status.message = 'deployed';
                  status.color = '#27CB00';
                } 
            }
          }
        }
      }

     return status;
  } catch(e) {
    console.log('Error on admin controllers main.js/getSaleStatus: ' + e);
  } 
};

/* This function is used to iterate through the project object, funding out if there has been any payments successfully made
 * It will then convert those payments to dollars depending on the currency it was paid in. 
 */
var getRevenue = function(_project, eth, btc){
  try{
      var project = _project;
      var revenue = 0;
      var tokenrevenue = 0;
      var salerevenue = 0;

      if(project.token){
        if(project.token.payment){
          if(project.token.payment.currency === 'eth'){
            tokenrevenue = project.token.payment.amount * eth;
          } else {
            tokenrevenue = project.token.payment.amount * btc;
          }
        }
      }

      if(project.crowdsales){
        for(var i = 0; i < project.crowdsales.length; i++){
          if(project.crowdsales[i].payment){
            if(project.crowdsales[i].payment.paid != null){
              if(project.crowdsales[i].payment.currency === 'eth'){
                var amount = project.crowdsales[i].payment.amount * eth;
                salerevenue = salerevenue + amount;
              } else {
                var amount = project.crowdsales[i].payment.amount * btc;
                salerevenue = salerevenue + amount;
              }
            }
          }
        }
      }

      revenue = tokenrevenue + salerevenue;
      return revenue.toFixed(2);
  } catch(e) {
    console.log('Error on admin controllers main.js/getRevenue: ' + e);
  } 
}

exports.projectReadOne = function(req, res){
  try{
      var requestOptions, path;

      // Split the path from the url so that we can call the correct server in development/production
      path = '/api/projects/' + req.params.projectname;
    
      requestOptions = {
        url: apiOptions.server + path,
        method : "GET",
        json : {}
      };

      request( requestOptions, function(err, response, body) { 
          renderProject(req, res, body);
      });
  } catch(e) {
    console.log('Error on admin controllers main.js/projectReadOne: ' + e);
  } 
};

var renderProject = function(req, res, body) { 
  try{
      var this_project = body[0];
      var message;

      if(req.query.err){
        if(req.query.err === 'nodata'){
          message = 'All fields are required!';
        } else if(req.query.err === 'invalidaddress'){
          message = 'Invalid contract address!';
        } else {
          message = 'Oops! Somethings gone wrong';
        }
      }

      this_project.token_status = getTokenStatus(this_project);
      this_project.sale_status = getSaleStatus(this_project);

      var data = {
        project: this_project,
        message: message
      };

      console.log('Admin data = ' + data);

      res.render('admin_project', data);
  } catch(e) {
    console.log('Error on admin controllers main.js/renderProject: ' + e);
  } 
}

var formatTokenData = function(req){
  try{
      var postdata = {
        address: req.body.contract_address,
        abi: req.body.abi,
        bytecode: req.body.bytecode,
        network: req.body.network,
        jsFileURL: req.body.jsfile,
        compiler: req.body.compiler
      }

      return postdata;
  } catch(e) {
    console.log('Error on admin controllers main.js/formatTokenData: ' + e);
  } 
};

exports.doTokenContractCreation = function(req, res){
  try{

    var requestOptions, path, projectname, postdata, access_token;
      
    projectname = req.params.projectname;
    
    path = "/api/admin/projects/" + projectname + '/token/contract';

    postdata = formatTokenData(req);
    access_token = req.session.passport.user.tokens.access_token;

    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata,
      headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
    }; 

    // Check the fields are present
    if (!postdata.address || !postdata.abi || !postdata.bytecode || !postdata.network || !postdata.jsFileURL || !postdata.compiler) {
        res.redirect('/admin/projects/' + projectname + '?err=nodata');
    } else if(!WAValidator.validate(postdata.address, 'ETH')){
        res.redirect('/admin/projects/' + projectname + '?err=invalidaddress');
    } else {

        request( requestOptions, function(err, response, body) {

            if (response.statusCode === 200) {
                res.redirect('/admin/projects/' + projectname + '#token');
            } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                res.redirect('/admin/projects/' + projectname + '?err=val');
            } else {
                res.render('error', { 
                  message: body.message,
                  error: {
                    status: 404
                  }
                });
            }
        });
    }
  } catch(e) {
    console.log('Error on admin controllers main.js/doTokenContractCreation: ' + e);
  } 
};

var formatSaleData = function(req){
  try{
      var postdata = {
        address: req.body.contract_address,
        abi: req.body.abi,
        bytecode: req.body.bytecode,
        network: req.body.network[0],
        jsFileURL: req.body.jsfile,
        compiler: req.body.compiler
      }

      return postdata;
  } catch(e) {
    console.log('Error on admin controllers main.js/formatSaleData: ' + e);
  } 
};

exports.doSaleContractCreation = function(req, res){
  try{

      var requestOptions, path, projectname, saleid, postdata, access_token;
        
      projectname = req.params.projectname;
      saleid = req.params.saleid;
      
      path = "/api/admin/projects/" + projectname + '/crowdsale/' + saleid + '/contract';

      postdata = formatSaleData(req);
      access_token = req.session.passport.user.tokens.access_token;

      requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata,
        headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' }
      }; 

      // Check the fields are present
      if (!postdata.address || !postdata.abi || !postdata.bytecode || !postdata.network || !postdata.jsFileURL || !postdata.compiler) {
          res.redirect('/admin/projects/' + projectname + '?err=nodata');
      } else if(!WAValidator.validate(postdata.address, 'ETH')){
          res.redirect('/admin/projects/' + projectname + '?err=invalidaddress');
      } else {

          request( requestOptions, function(err, response, body) {

              if (response.statusCode === 200) {
                  res.redirect('/admin/projects/' + projectname + '#sale-' + saleid);
              } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                  res.redirect('/admin/projects/' + projectname + '?err=val');
              } else {
                  res.render('error', { 
                    message: body.message,
                    error: {
                      status: 404
                    }
                  });
              }
          });
      }
  } catch(e) {
    console.log('Error on admin controllers main.js/doSaleContractCreation: ' + e);
  } 
};