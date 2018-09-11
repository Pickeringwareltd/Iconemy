'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

var discountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	}
});

discountSchema.plugin(uniqueValidator);
mongoose.model('Discount', discountSchema);