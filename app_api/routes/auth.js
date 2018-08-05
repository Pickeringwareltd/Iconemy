var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var jwt_audience = 'http://localhost:3000/api';

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  jwt_audience = 'https://www.iconemy.io/api';
}

var needsLogIn = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://damp-surf-6213.auth0.com/.well-known/jwks.json"
    }),
    audience: jwt_audience,
    issuer: "https://damp-surf-6213.auth0.com/",
    algorithms: ['RS256']
});

module.exports = needsLogIn;