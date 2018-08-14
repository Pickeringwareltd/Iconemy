var KeenTracking = require('keen-tracking');

// Configure a client instance
var client = new KeenTracking({
  projectId: '5b573abcc9e77c000175c9eb',
  writeKey: 'A1082A66A7AAD875D36A37E2C59C1477BB9113C4D4F0B67CAED20C1BFBC9AF04E25176C22035FE335C19BCC37957B1982DAA2A1FFA98CFAACEE6940BD97B666E3EABAC8B146CDC3E651AA7DFA500A1F92226E537A599490F3CDBA126503F0F33'
});

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.view = function(req, res, next){

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
}; 

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.apicall = function(req, res, next){

	// Record an event
	client.recordEvent('apicalls', {
	  path: req.path,
	  refer: req.headers.referer
	});

	next();
};

module.exports.projectview = function(req, res, project){
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
}

module.exports.tokenview = function(req, res, project){
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
}

module.exports.crowdsaleview = function(req, res, project, sale){
	var mobile = false; 

	if(req.headers['user-agent'].includes('Mobile')){
		mobile = true;
	}

	// Record an event
	client.recordEvent('crowdsaleviews', {
	  path: req.path,
	  user: req.headers['user-agent'],
	  mobile: mobile,
	  project: project,
	  sale: sale,
	  refer: req.headers.referer
	});
}

// This is fired from the API when a new user is recognised
module.exports.registration = function(email, id){
	// Record an event
	client.recordEvent('registrations', {
	  email: email,
	  userid: id
	});
};

// This is fired from the API when a new user is recognised
module.exports.login = function(req, email, id){
	// Record an event
	client.recordEvent('logins', {
	  email: email,
	  userid: id
	});
};

// Records the subscription event, this is called via the api controller upon successful subscription
module.exports.subscribe = function(req){

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
};

// Records the message event, this is caled via the api controller upon contact
module.exports.contact = function(req){

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
};



// This is fired from the API when a new user is recognised
module.exports.newproject = function(project){
	// Record an event
	client.recordEvent('projects-created', {
	  project: project
	});
};

// This is fired from the API when a new user is recognised
module.exports.newtoken = function(token){
	// Record an event
	client.recordEvent('tokens-created', {
	  token: token
	});
};

// This is fired from the API when a new user is recognised
module.exports.newcrowdsale = function(crowdsale){
	// Record an event
	client.recordEvent('crowdsales-created', {
	  crowdsale: crowdsale
	});
};

// This is fired from the API when a new user is recognised
module.exports.paymentconfirmed = function(payment, type){

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
	  payment: pay
	});
};

// This is fired from the API when a new user is recognised
module.exports.paymentfinalised = function(payment, type){

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
	  payment: pay
	});
};

