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
     type: String,
     required: true
   },
   firstname: {
   	 type: String
   },
   surname: {
   	 type: String
   },
   role: {
   	type: String,
   	"default": "user"
   }
});