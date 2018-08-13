var KeenTracking = require('keen-tracking');

// Configure a client instance
var client = new KeenTracking({
  projectId: '5b573abcc9e77c000175c9eb',
  writeKey: 'A1082A66A7AAD875D36A37E2C59C1477BB9113C4D4F0B67CAED20C1BFBC9AF04E25176C22035FE335C19BCC37957B1982DAA2A1FFA98CFAACEE6940BD97B666E3EABAC8B146CDC3E651AA7DFA500A1F92226E537A599490F3CDBA126503F0F33'
});

var view = function(req, res, next){

	var mobile = true; 

	if(req.headers['user-agent'].includes('Mobile')){
		mobile = false;
	}

	// Record an event
	client.recordEvent('pageviews', {
	  path: req.path,
	  user: req.headers['user-agent'],
	  mobile: mobile
	});

	next();
}

module.exports = view;