'use strict';

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var jwtURI = 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json';
var jwtISSUER = 'https://' + process.env.AUTH0_DOMAIN + '/';
var jwt_audience = 'http://localhost:3000/api';

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  jwt_audience = 'https://www.iconemy.io/api';
}

if (process.env.USING_STAGING === 'true') {
  jwt_audience = process.env.STAGING_URL + '/api'; 
}

var needsLogIn = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwtURI
    }),
    audience: jwt_audience,
    issuer: jwtISSUER,
    algorithms: ['RS256']
});

module.exports = needsLogIn;