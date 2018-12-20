'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const User = mongoose.model('User');
const tracking = require('../../add-ons/tracking');
const errors = require('../../add-ons/errors');
const sendEmail = require('../../add-ons/emails');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const md5 = require('md5')

// Send a JSON response with the status and content passed in via params
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.show = function (req, res) {
    return res.status(200).json(req.user)
}

// This is used to check if the user is an admin or a user (and has access to the admin section)
module.exports.checkRole = function (req, res) {
    try {
        var id = req.params.userid;

        User
            .find({userid: id})
            .exec(function (err, user) {

                if (user.length != 0) {

                    var user = user[0];

                    if (user.role === 'admin') {
                        sendJsonResponse(res, 200, {"result": 'admin'});
                        return;
                    } else {
                        sendJsonResponse(res, 200, {"result": 'user'});
                        return;
                    }

                } else if (err != undefined) {
                    errors.print(err, 'Error getting user: ');
                    sendJsonResponse(res, 404, {"result": "error", "message": 'Error getting user'});
                    return;
                }
            });
    } catch (e) {
        errors.print(e, 'Error on API controllers user.js/checkRole: ');
    }
};

var getUserData = function (req) {
    try {
        var data = {
            userid: req.body.userid,
            email: req.body.email
        };

        return data;
    } catch (e) {
        errors.print(e, 'Error on API controllers user.js/getUserData: ');
    }
}

module.exports.checkLogIn = function (req, res) {
    try {

        var data = getUserData(req);

        if (validator.isEmail(data.email)) {

            User
                .find({userid: data.userid})
                .exec(function (err, user) {

                    if (user.length != 0) {

                        var user = user[0];

                        tracking.login(req, user.email, user.userid);
                        sendJsonResponse(res, 200, {"result": "existing"});
                        return;
                    } else if (err != undefined) {
                        errors.print(err, 'Error getting user data');
                        sendJsonResponse(res, 404, {"result": "error", "message": 'Error getting user data'});
                        return;
                    } else {

                        // Create subscription creates a new document in the database
                        User
                            .create(data, function (err, user) {
                                // Callback is used to report an error or return project on successful save
                                if (err) {
                                    errors.print(err, 'Error saving user: ');
                                    sendJsonResponse(res, 400, {"result": "error", "message": 'Error saving user'});
                                    return;
                                } else {
                                    // Track user sign up
                                    tracking.registration(user.email, user.userid);
                                    sendEmail.sendSignUpEmail(user.email);
                                    sendJsonResponse(res, 201, {"result": "created"});
                                }
                            });
                    }
                });
        } else {
            sendJsonResponse(res, 400, {"result": "error", "message": "Please enter a valid email address"});
            return;
        }

    } catch (e) {
        errors.print(e, 'Error on API controllers user.js/checkLogIn: ');
    }
};

module.exports.login = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err || !user) {
            console.log(info);
            return res.status(200).json({
                success: false,
                message: 'Please enter your username/password correctly',
            });
        }

        if (user.email_token) {
            return res.status(200).json({
                success: false,
                message: 'Account not verified yet. Please check your email.',
            });
        }

        let response = user.toAuthJSON();

        req.session.token = response.token;
        res.cookie('jwt', response.token)
        response.success = true;

        return res.json(response);
    })(req, res, next);
};

module.exports.register = (req, res, next) => {
    const { validationResult } = require('express-validator/check');

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            success:false,
            errors: errors.array().map(err => err.msg)
        });
    }

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        email_token: md5(moment().unix())
    });

    User.register(user, req.body.password, function(err) {
        if (err) {
            let errors = [];
            if (err.errors !== undefined) {
                errors = Object.keys(err.errors)
                    .map(field => err.errors[field].message);
            } else {
                errors.push(err.message);
            }

            return res.json({
                success: false,
                errors
            });
        }

        tracking.registration(user.email, user.userid);
        var signup_url = 'https://www.iconemy.io/confirm?code=' + user.email_token;

        sendEmail.sendSignUpEmail(user.email, signup_url);

        return res.json({
            success: true,
            user: user.username
        })
    });
}