var mongoose = require('mongoose');

var crowdsaleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	pricingMechanism: {
		type: String,
		required: true,
		"default": 'linear'
	},
	public: {
		type: Boolean,
		required: true
	},
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: ObjectID,
		required: true
	}
});

var tokenSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	symbol: {
		type: String,
		required: true
	},
	decimals: {
		type: Number,
		required: true,
		min: 0,
		max: 18
	},
	logo: String,
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: ObjectID,
		required: true
	}
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
		required: true
	}, 
	description: {
		type: String,
		required: true
	},
	website: {
		type: String,
		required: true
	},
	subdomain: {
		type: String,
		required: true
	},
	whitepaper: String,
	onepager: String,
	logo: String,
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: ObjectID,
		required: true
	},
	social: socialSchema,
	token: tokenSchema,
	crowdsales: [crowdsaleSchema]
});