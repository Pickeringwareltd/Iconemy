var express = require('express');
var request = require('request');
var moment = require('moment');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
}

exports.index = function(req, res){
	res.render('admin_portal');
};

exports.projects = function(req, res){

	var requestOptions, path;

  	// Split the path from the url so that we can call the correct server in development/production
  	path = '/api/admin/projects';
  
  	requestOptions = {
  		url: apiOptions.server + path,
  		method : "GET",
  		json : {}
	   };

   	request( requestOptions, function(err, response, body) { 
      	renderProjects(req, res, body);
   	});
};

var renderProjects = function(req, res, body){

  var data = body;
  var projects = [];

  // Call the pricing URL to get accurate information on USD -> BTC/ETH prices
  var price_url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH';

  requestOptions = {
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
  var project = _project;
  var status = {
    message: 'none',
    color: '#A2A2A2'
  }

  if(project.token){
    status.message = 'needs payment';
    status.color = '#F09300';
    if(project.token.discount_code == 'GIVEMEITFREE' || typeof project.token.payment !== "undefined"){
      status.message = 'needs deploying';
      status.color = '#0007FF';
      if(project.token.deployed == 'Done'){
        status.message = 'deployed';
        status.color = '#27CB00';
      } 
    }
  }

 return status;
};

var getSaleStatus = function(_project){
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
        if(typeof project.crowdsales[i].payment.paid !== "undefined" || project.crowdsales[i].discount_code == 'GIVEMEITFREE'){
          status.message = 'needs deploying';
          status.color = '#0007FF';

            if(project.crowdsales[i].deployed == 'Done'){
              status.message = 'deployed';
              status.color = '#27CB00';
            } 
        }
      }
    }
  }

 return status;
};

/* This function is used to iterate through the project object, funding out if there has been any payments successfully made
 * It will then convert those payments to dollars depending on the currency it was paid in. 
 */
var getRevenue = function(_project, eth, btc){
  var project = _project;
  var revenue = 0;
  var tokenrevenue = 0;
  var salerevenue = 0;

  if(project.token){
    if(project.token.payment){
      if(project.token.payment.currency == 'eth'){
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
          if(project.crowdsales[i].payment.currency == 'eth'){
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
}

exports.projectReadOne = function(req, res){

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
};

var renderProject = function(req, res, body) { 
    var this_project = body[0];

    this_project.token_status = getTokenStatus(this_project);
    this_project.sale_status = getSaleStatus(this_project);

    var data = {
      project: this_project
    };

    res.render('admin_project', data);
}