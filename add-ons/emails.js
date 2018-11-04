'use strict';

const sgMail = require('@sendgrid/mail');


var checkEnv = function(_email){
	if (process.env.NODE_ENV === 'production') {
		return _email;
	} else if (process.env.NODE_ENV === 'staging'){
		return _email;
	} else {
		return 'jp@iconemy.io';
	}
}

// This is fired from the middleware used by both API and server, the function is stored in app.js
module.exports.sendEmail = function(_email, substitutions){
	try{
		// using SendGrid's v3 Node.js Library
		// https://github.com/sendgrid/sendgrid-nodejs
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		// This allows us to send jack the emails in development mode
		var email = checkEnv(_email);

		const msg = {
			to: email,
			from: 'jp@iconemy.io',
			subject: 'Hello world',
			text: 'Hello plain world!',
			html: '<p>Hello HTML world!</p>',
			templateId: 'd-0fa622099d954e6fb33d49011048a04e',
			sub : substitutions
		};
		
		sgMail.send(msg);
	} catch(e) {
		console.log('Error on API controllers crowdsales.js/sendEmail: ' + e);
	}
}; 

module.exports.sendSignUpEmail = function(_email){
	try{
		// using SendGrid's v3 Node.js Library
		// https://github.com/sendgrid/sendgrid-nodejs
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		// This allows us to send jack the emails in development mode
		var email = checkEnv(_email);

		const msg = {
		  to: email,
		  from: 'jp@iconemy.io',
		  subject: 'Hello world',
		  text: 'Hello plain world!',
		  html: '<p>Hello HTML world!</p>',
		  templateId: 'd-a863d706bc2a48d59b76150a51aa7048'
		};

		sgMail.send(msg);
	} catch(e) {
		console.log('Error on API controllers user.js/sendEmail: ' + e);
	}
};

module.exports.sendResetPassword = function(_email, substitutions){
    try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        var email = checkEnv(_email);

        const msg = {
            to: email,
            from: 'jp@iconemy.io',
            subject: 'Reset password',
            text: 'Hello plain world!',
            html: '<p>Hello HTML world!</p>',
            templateId: 'd-a863d706bc2a48d59b76150a51aa7048',
			subs: substitutions
        };

        sgMail.send(msg);
    } catch(e) {
        console.log('Error on API controllers user.js/sendEmail: ' + e);
    }
};