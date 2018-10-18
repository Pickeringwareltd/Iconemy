'use strict';

var KeenTracking = require('keen-tracking');

// Configure a client instance
const client = new KeenTracking({
  projectId: process.env.KEEN_PROJECT_ID,
  writeKey: process.env.KEEN_WRITE_KEY
});

// // Configure a client instance
// const client = new KeenTracking({
//   projectId: '5b573abcc9e77c000175c9eb',
//   writeKey: 'A1082A66A7AAD875D36A37E2C59C1477BB9113C4D4F0B67CAED20C1BFBC9AF04E25176C22035FE335C19BCC37957B1982DAA2A1FFA98CFAACEE6940BD97B666E3EABAC8B146CDC3E651AA7DFA500A1F92226E537A599490F3CDBA126503F0F33'
// });

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.view = function(req, res, next){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		// Get the users IP address
		var ipaddress = req.headers['x-forwarded-for'] || 
	     req.connection.remoteAddress || 
	     req.socket.remoteAddress ||
	     (req.connection.socket ? req.connection.socket.remoteAddress : null);

		// Record an event
		client.recordEvent('pageviews', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  refer: req.headers.referer,
		  ip: ipaddress
		});

		next();
	} catch(e) {
		console.log('Error on tracking.js/view: ' + e);
		next();
	}
}; 

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.apicall = function(req, res, next){
	try{
		// Record an event
		client.recordEvent('apicalls', {
		  path: req.path,
		  refer: req.headers.referer
		});

		next();
	} catch(e) {
		console.log('Error on tracking.js/apicall: ' + e);
		next();
	}
};

module.exports.projectview = function(req, res, project){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		var token = false;
		var crowdsale = false;

		if(typeof(project.token) != undefined){
			token = true;
		}

		if(typeof(project.crowdsale) != undefined){
			crowdsale = true;
		}	

		// Record an event
		client.recordEvent('projectviews', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  project: project.id,
		  hastoken: token,
		  hassales: crowdsale,
		  refer: req.headers.referer
		});
	} catch(e) {
		console.log('Error on tracking.js/projectview: ' + e);
	}
}

module.exports.tokenview = function(req, res, project){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		// Record an event
		client.recordEvent('tokenviews', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  project: project,
		  refer: req.headers.referer
		});
	} catch(e) {
		console.log('Error on tracking.js/tokenview: ' + e);
	}
}

module.exports.crowdsaleview = function(req, res, project, sale){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		// Record an event
		client.recordEvent('crowdsaleviewingexample', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  project: project,
		  sale: sale,
		  refer: req.headers.referer
		});

		console.log(process.env.KEEN_PROJECT_ID);

	} catch(e) {
		console.log('Error on tracking.js/crowdsaleview: ' + e);
	}
}

// This is fired from the API when a new user is recognised
module.exports.registration = function(email, id){
	try{
		// Record an event
		client.recordEvent('registrations', {
		  email: email,
		  userid: id
		});
	} catch(e) {
		console.log('Error on tracking.js/registration: ' + e);
	}
};

// This is fired from the API when a new user is recognised
module.exports.login = function(req, email, id){
	try{
		// Record an event
		client.recordEvent('logins', {
		  email: email,
		  userid: id
		});
	} catch(e) {
		console.log('Error on tracking.js/login: ' + e);
	}
};

// Records the subscription event, this is called via the api controller upon successful subscription
module.exports.subscribe = function(req){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		// Record an event
		client.recordEvent('subscriptions', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  email: req.body.youremail,
		  refer: req.headers.referer
		});
	} catch(e) {
		console.log('Error on tracking.js/subscribe: ' + e);
	}
};

// Records the message event, this is caled via the api controller upon contact
module.exports.contact = function(req){
	try{
		var mobile = false; 

		if(req.headers['user-agent'].includes('Mobile')){
			mobile = true;
		}

		// Record an event
		client.recordEvent('contact-messages', {
		  path: req.path,
		  user: req.headers['user-agent'],
		  mobile: mobile,
		  email: req.body.email,
		  name: req.body.name,
		  message: req.body.message,
		  refer: req.headers.referer
		});
	} catch(e) {
		console.log('Error on tracking.js/contact: ' + e);
	}
};



// This is fired from the API when a new user is recognised
module.exports.newproject = function(project){
	try{
		// Record an event
		client.recordEvent('projects-created', {
		  project: project
		});
	} catch(e) {
		console.log('Error on tracking.js/newproject: ' + e);
	}
};

// This is fired from the API when a new user is recognised
module.exports.newtoken = function(token){
	try{
		// Record an event
		client.recordEvent('tokens-created', {
		  token: token
		});
	} catch(e) {
		console.log('Error on tracking.js/newtoken: ' + e);
	}
};

// This is fired from the API when a new user is recognised
module.exports.newcrowdsale = function(crowdsale){
	try{
		// Record an event
		client.recordEvent('crowdsales-created', {
		  crowdsale: crowdsale
		});
	} catch(e) {
		console.log('Error on tracking.js/newcrowdsale: ' + e);
	}
};

// This is fired from the API when a new user is recognised
module.exports.paymentconfirmed = function(payment, type){
	try{
		var pay = {
			currency: payment.currency,
			amount: payment.amount,
			address: payment.ethWallet.address,
			created: payment.created,
			createdBy: payment.createdBy
		}

		// Record an event
		client.recordEvent('payments-confirmed', {
		  product: type,
		  currency: pay.currency,
		  amount: pay.amount,
		  address: pay.address,
		  created: pay.created,
		  createdBy: pay.createdBy
		});
	} catch(e) {
		console.log('Error on tracking.js/paymentconfirmed: ' + e);
	}
};

// This is fired from the API when a new user is recognised
module.exports.paymentfinalised = function(payment, type){
	try{
		var pay = {
			currency: payment.currency,
			amount: payment.amount,
			address: payment.ethWallet.address,
			paid: payment.paid,
			created: payment.created,
			createdBy: payment.createdBy
		}

		// Record an event
		client.recordEvent('payments-finalised', {
		  product: type,
		  currency: pay.currency,
		  amount: pay.amount,
		  address: pay.address,
		  paid: pay.paid,
		  created: pay.created,
		  createdBy: pay.createdBy
		});
	} catch(e) {
		console.log('Error on tracking.js/paymentfinalised: ' + e);
	}
};
