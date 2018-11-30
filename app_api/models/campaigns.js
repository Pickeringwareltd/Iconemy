'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Simply holds links to all of the social sites the project is part of
var socialSchema = new mongoose.Schema({
	facebook: String,
	twitter: String,
	youtube: String,
	bitcointalk: String,
	telegram: String,
	medium: String,
	instagram: String,
	reddit: String
});

var tokenSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true,
		required: [true, 'A token name is required']
	},
	abbreviation: {
		type: String,
		index: true,
		required: [true, 'A token abbreviation is required']
	},
	total_supply: Number,
	contract_address: String,
	type: {
		type: String,
		index: true,
		required: [true, 'A token type is required']
	},
	logo_url: {
		type: String,
		index: true,
		required: [true, 'A token logo URL is required']
	}
});

var crowdsaleSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true,
		required: [true, 'A token name is required']
	},
	start_date: {
		type: Date,
		index: true,
		required: [true, 'A start date is required']
	},
	end_date: {
		type: Date,
		index: true,
		required: [true, 'An end date is required']
	},
	total_tokens: {
		type: Number,
		required: [true, 'Tokens available is required']
	},
	token_price: {
		type: Number,
		required: [true, 'A token price is required']
	},
	has_introducer: {
		type: Boolean,
		required: [true, 'Must specify is introducer is available']
	}
});

var teamMemberSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true,
		required: [true, 'Team members name is required']
	},
	role: {
		type: String,
		required: [true, 'Team members role is required']
	},
	photo: {
		type: String,
		required: [true, 'Team members photo URL is required']
	},
	description: {
		type: String,
		required: [true, 'Team members description is required']
	},
	social: socialSchema,
	index: {
		type: Number,
		"default": 0
	}
});

// Simply holds links to all of the social sites the project is part of
var tagSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true,
		required: [true, 'Tag name is required']
	}	
});

// contains all of the data about a project 
var campaignSchema = new mongoose.Schema({ 
	name: {
		type: String,
		index: true,
		required: [true, 'A campaign name is required']
	}, 
	domain: {
		type: String,
		required: [true, 'A campaign domain is required']
	},
	description: {
		type: String,
		required: [true, 'A campaign description is required']
	},
	tag_line: {
		type: String,
		required: [true, 'A campaign tag line is required']
	},
	website_url: {
		type: String,
		unique: true,
		required: [true, 'A campaign website URL is required, if you dont have one yet, use your facebook page']
	},
	video_url: String,
	js_file_url: String,
	current_sale_index: Number,
	whitepaper_url: String,
	onepager: String,
	cover_photo: String,
	social: socialSchema,
	tags: [tagSchema],
	token: tokenSchema,
	crowdsales: [crowdsaleSchema],
	team: [teamMemberSchema],
	created: {
		type: Date,
		required: true
	},
	createdBy: {
		type: String,
		required: [true, 'We need to know who created the campaign']
	}
});

campaignSchema.plugin(uniqueValidator);

mongoose.model('Campaign', campaignSchema);