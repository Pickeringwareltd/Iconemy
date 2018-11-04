'use strict';

var express = require('express');
var request = require('request');
const errors = require('../../add-ons/errors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var apiOptions = {
  server : "http://localhost:3000"
};

// If we are running on production, use the production server
if (process.env.NODE_ENV === 'production') {
  	apiOptions.server = "http://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

exports.require = function (req, res, next) {
    if (req.user.isAdmin()) return next()

    return res.status(400).json({
        message: 'Not an admin'
    })
};