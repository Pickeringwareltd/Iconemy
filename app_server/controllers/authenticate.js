'use strict';

const User = require('../../app_api/models/users')
const tracking = require('../../add-ons/tracking')
const sendEmail = require('../../add-ons/emails')
const request = require('request')
const md5 = require('md5')
const moment = require('moment')

exports.showRegisterForm = (req, res) => {
    return res.render('signup', {
        user: new User(),
        errors: []
    });
};

exports.showLoginForm = (req, res) => {
    if (res.locals.loggedIn) {
        return request.get('http://localhost:3000/api/user/me', { auth: { bearer: req.cookies['jwt'] } }, (err, response, body) => {
            if ('Unauthorized' === body) {
                res.clearCookie('jwt');

                return res.redirect('/login');
            }

            const user = JSON.parse(body);

            if (user.role === 'admin') return res.redirect('/admin')

            return res.redirect('/projects')
        })
    }

    return res.render('login', {
        user: new User()
    });
};

exports.session = (req, res) => {
    const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
    delete req.session.returnTo;

    return res.redirect(redirectTo);
};

exports.confirm = (req, res) => {
    if (! req.query.code) return res.redirect('/');

    User.findOne(
        { email_token : req.query.code },
        (err, user) => {
            if (err) return res.status(200).send(err)
            if (! user) return res.redirect('/')

            user.email_token = '';
            user.save({ validateBeforeSave: false });

            return res.redirect('/login')
        }
    );
};

exports.forgot = (req, res) => {
    return res.render('forgot_password');
};

exports.send = (req, res) => {
    User.findOne(
        { email : req.body.email },
        (err, user) => {
            if (!user || err) {
                return res.redirect('/forgot-password');
            }

            const token = md5(moment().unix());

            user.reset_token = token;
            user.save({ validateBeforeSave: false });

            // THIS NOW EXPECTS EMAIL, USERNAME AND URL
            sendEmail.sendResetPassword(user.email, user.username, token);

            return res.redirect('/forgot-password');
        })
};

exports.reset_form = (req, res) => {
    User.findOne(
        { reset_token : req.query.token },
        (err, user) => {
            if (! user || err) return res.redirect('/forgot-password');

            return res.render('reset', { errors: [] });
        }
    )

};

exports.reset = (req, res) => {
    const { validationResult } = require('express-validator/check');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('reset', {
            errors: errors.array().map(err => err.msg)
        });
    }

    User.findOne(
        { reset_token : req.query.token },
        (err, user) => {
            if (! user || err) return res.redirect('/forgot-password');

            user.password = req.body.password;
            user.save({ vaidateBeforeSave: false })

            return res.redirect('reset-password');
        }
    )
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};