var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var needsLogIn = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://damp-surf-6213.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://localhost:3000/api',
    issuer: "https://damp-surf-6213.auth0.com/",
    algorithms: ['RS256']
});

module.exports = needsLogIn;