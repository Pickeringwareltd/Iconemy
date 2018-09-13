'use strict';

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtURI = 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json';
var jwtISSUER = 'https://' + process.env.AUTH0_DOMAIN + '/';

var needsLogIn = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwtURI
    }),
    issuer: jwtISSUER,
    algorithms: ['RS256'],
    getToken: function fromSession (req) {
    	if(req.session.passport == undefined){	
    		return null;
	    } else {
	    	// get the token from the users session, decode it and validate it
	    	var id_token = req.session.passport.user.tokens.id_token;
	    	return id_token;
	    }
    }
});

module.exports = needsLogIn;