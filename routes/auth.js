'use strict';

const passport = require('passport');
module.exports = passport.authenticate('jwt', { session : true, failureRedirect: '/login' });
