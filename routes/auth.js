var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var needsLogIn = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://damp-surf-6213.auth0.com/.well-known/jwks.json"
    }),
    issuer: "https://damp-surf-6213.auth0.com/",
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