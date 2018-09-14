'use strict';

const sgMail = require('@sendgrid/mail');


var checkEnv = function(email){
	if (process.env.NODE_ENV === 'production') {
		return email;
	} else if (process.env.NODE_ENV === 'staging'){
		return email;
	} else {
		return 'jp@iconemy.io'; 
	}
}

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.sendEmail = function(email){
	try{
		// using SendGrid's v3 Node.js Library
		// https://github.com/sendgrid/sendgrid-nodejs
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		// This allows us to send jack the emails in development mode
		email = checkEnv(email);

		const msg = {
			to: email,
			from: 'jp@iconemy.io',
			subject: 'Hello world',
			text: 'Hello plain world!',
			html: '<p>Hello HTML world!</p>',
			templateId: 'd-0fa622099d954e6fb33d49011048a04e'
		};

		sgMail.send(msg);
	} catch(e) {
		console.log('Error on API controllers crowdsales.js/sendEmail: ' + e);
	}
}; 
