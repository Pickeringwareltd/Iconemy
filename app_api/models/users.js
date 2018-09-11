'use strict';

var mongoose = require( 'mongoose' );
var jwt = require('jsonwebtoken');
require('dotenv').load();

var userSchema = new mongoose.Schema({
  email: {
     type: String,
     unique: true,
     required: true
   }, 
   nickname: {
     type: String
   },
   firstname: {
   	 type: String
   },
   surname: {
   	 type: String
   },
   userid: {
    type: String,
    unique: true,
    required: true
   },
   role: {
   	type: String,
   	"default": "user"
   }
});

mongoose.model('User', userSchema);

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
   }
});

mongoose.model('Subscription', subscriptionSchema);

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
   time: {
     type: Date,
     required: true
   },
   responded: {
     type: Boolean
   }
});

mongoose.model('Contact', contactSchema);