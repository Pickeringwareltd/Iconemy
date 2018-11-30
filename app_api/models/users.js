'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const owasp = require('owasp-password-strength-test');
const jwt = require('jsonwebtoken');

owasp.config({ minLength : 8 });

var transactionSchema = new mongoose.Schema({
    tx_id: {
        type: String,
        required: [true, 'Please provide TX ID.']
    },
    timestamp: {
        type: Date,
        required: [true, 'Please provide TX time.']
    },
    campaign_id: {
        type: String,
        required: [true, 'Please provide a campaign ID.']
    },
    successful: {
        type: Boolean,
        required: [true, 'We need to know if it was successful.']
    },
    tokens: {
        type: Number,
        required: [true, 'Please provide the token amount']
    },
    bonus_tokens: Number,
    ether: {
        type: Number,
        required: [true, 'Please provide ETH.']
    },
    address: {
        type: String,
        required: [true, 'Please provide address.']
    },
    introducer: String,
    index: 0
});

var userSchema = new mongoose.Schema({
    email : {
        type : String,
        default : '',
        required : [true, 'Please provide an email address'],
        index : { unique : true },
        lowercase : true,
        trim : true,
        validate : [
            {
                validator : (value) => {
                    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return regex.test(value);
                },
                message : 'Please provide a valid email address.'
            }, {
                validator : function (value) {
                    return new Promise(function (resolve, reject) {
                        User.find({ email : value }).exec((err, users) => {
                            if (err) reject();

                            resolve(users.length === 0);
                        });
                    });
                },
                message : 'Please choose a different email.'
            }
        ]
    },
    name: {
        type: String,
        default: '',
        required: [true, 'Please provide your full name.']
    },
    role : { type : String, default : 'user' },
    email_token : { type : String, default : '' },
    reset_token : { type : String, default : '' },
    created_at : {
        type: Date,
        default : moment().utc(),
        get (value) {
            return moment(value);
        }
    },
    transactions: [transactionSchema]
});

userSchema.methods.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this._id,
    }, '_iconemy_secret_secret', {
        expiresIn: '1d',
        algorithm: 'HS256'
    });
}

userSchema.methods.toAuthJSON = function() {
    return {
        id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

userSchema.methods.isAdmin = function () {
    return 'admin' === this.role;
}

userSchema.methods.isOwner = function () {
    return 'owner' === this.role;
}

userSchema.methods.isUser = function () {
    return 'user' === this.role;
}

userSchema.plugin(require('mongoose-bcrypt'));
userSchema.plugin(require('passport-local-mongoose'));
const User = mongoose.model('User', userSchema);

var subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    mailing_list: {
        type: Boolean
    },
    page: {
        type: String
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

var contactSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    page: {
        type: String
    },
    time: {
        type: Date,
        required: true
    },
    responded: {
        type: Boolean
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = User;