var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

var paymentSchema = new mongoose.Schema({
	currency: {
		type: String,
		required: [true, 'Currency is required']
	},
	amount: {
		type: Number,
		required: [true, 'Amount is required']
	},
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: String,
		required: [true, 'We need to know who created the payment']
	},
	paid: {
		type: Date,
		required: false
	},
	sentTo: {
		type: String,
		validate: {
	    	validator: function(v) {
	        	return /^0x{1}[a-fA-F0-9]{40}$/.test(v);
	      	},
	      	message: '{VALUE} is not a ETH valid address'
	    },
		required: false
	},
	sentFrom: {
		type: String,
		validate: {
	    	validator: function(v) {
	        	return /^0x{1}[a-fA-F0-9]{40}$/.test(v);
	      	},
	      	message: '{VALUE} is not a valid ETH address'
	    },
		required: false
	}
});

var tokenSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Token name is required']
	},
	symbol: {
		type: String,
		required: [true, 'Token symbol is required']
	},
	decimals: {
		type: Number,
		required: [true, 'Token decimals is required'],
		min: 0,
		max: 18
	},
	logo: String,
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: String,
		required: [true, 'We need to know who created the token']
	},
	payment: paymentSchema
});

var crowdsaleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Crowdsale name is required']
	},
	status: {
		type: String,
		required: true
	},
	start: {
		type: Date,
		required: [true, 'Start date is required']
	},
	end: {
		type: Date,
		required: [true, 'End date is required']
	},
	pricingMechanism: {
		type: String,
		required: [true, 'Pricing mechanism is required'],
		"default": 'linear'
	},
	public: {
		type: Boolean,
		required: [true, 'Sale type is required']
	},
	commission: {
		type: Number,
		required: [true, 'Commission amount is required'],
		min: 0,
		max: 5
	},
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: String,
		required: [true, 'We need to know who created the crowdsale']
	},
	payment: paymentSchema
});

// Simply holds links to all of the social sites the project is part of
var socialSchema = new mongoose.Schema({
	facebook: String,
	twitter: String,
	youtube: String,
	bitcointalk: String,
	github: String,
	medium: String
});

// contains all of the data about a project 
var projectSchema = new mongoose.Schema({ 
	name: {
		type: String,
		index: true,
		required: [true, 'A project name is required']
	}, 
	description: {
		type: String,
		required: [true, 'A project description is required']
	},
	website: {
		type: String,
		unique: true,
		required: [true, 'A project website URL is required, if you dont have one yet, use your facebook page']
	},
	subdomain: {
		type: String,
		uniqueCaseInsensitive: true,
		required: [true, 'A subdomain is required so that investors can find your project']
	},
	whitepaper: String,
	onepager: String,
	logo: String,
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: String,
		required: [true, 'We need to know who created the project']
	},
	social: socialSchema,
	token: tokenSchema,
	crowdsales: [crowdsaleSchema]
});

projectSchema.plugin(uniqueValidator);

mongoose.model('Project', projectSchema);