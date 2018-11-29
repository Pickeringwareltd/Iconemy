'use strict';

var express = require('express');
var request = require('request');
var tracking = require('../../add-ons/tracking');
const errors = require('../../add-ons/errors');

var apiOptions = {
  server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://www.iconemy.io";
} else if (process.env.NODE_ENV === 'staging'){
  apiOptions.server = process.env.STAGING_URL;
}

var metafusion_object = {
	user: {
		userid: '12345678',
		
	},
	project: {
		name: 'MetaFusion',
		cover_photo: '/ico_dashboard/images/metafusion_cover.png',
		website_url: 'https://www.metafusion.io',
		tag_line: 'ALL TOP 100 CRYPTOCURRENCIES IN JUST ONE TOKEN',
		description: 'MetaFusion combines all of the top 100 cryptocurrecniess on https://coinmarketcap.com (except those screened-out as scams or for other investment analysis reasons - see Whitepaper for details) plus many of those outside of the top 100 that have certain “growth” characteristics or other unique or special features. MetaFusion therefore provides a COMPLETE cryptocurrency investment solution. By investing in MetaFusion you have the asset class fully covered in just one token.',
		video_url: '',
		js_file_url: 'https://ucarecdn.com/727ffd84-febd-4ab4-9c07-f126d6572afc/new_sale.js',
		current_sale_index: null,
		social_links: {
			twitter: 'https://twitter.com/MetaFusionToken',
			instagram: 'https://www.instagram.com/MetaFusionToken/'
		}, 
		whitepaper_url: 'https://docs.wixstatic.com/ugd/ed187e_489cc070bbc74664b100d7906b5e94f1.pdf',
		tags: ['ethereum', 'erc-20', 'investment', 'fund'],
		crowdsales: [
			{
			 	name: 'Public sale 1',
			 	start_date: '2018-12-22 12:00:00.853Z',
			 	end_date: '2019-1-22 12:00:00.853Z',
			 	total_tokens: 100000000,
			 	token_price: 0.0012,
			 	has_introducer: true,
			 }
		],
		token: {
			name: 'MetaFusion Token',
			abbreviation: 'MTF',
			total_supply: 100000000,
			contract_address: '0XD2590EE9446DA6AE102A7CBA322071ADE322E077',
			type: 'erc-20',
			logo_url: '/ico_dashboard/images/metafusion_logo.png'
		},
		team: [
			{
				name: 'Sasha Svyatkin',
				role: 'Internal manager',
				photo: '/ico_dashboard/images/team_image_1.png',
				description: "Sasha is a graduate of the National Research Nuclear University MEPhI in Moscow and is responsible for coordinating the reporting aspects of the project including the publication of the Master Portfolio's Net Asset Value each week and other Tokenholder reporting. He will also work in coordinating the project's overall internal management having held previous management positions in the telecommunications field.",
				social_links: {
					twitter: 'https://twitter.com/MetaFusionToken',
					instagram: 'https://www.instagram.com/MetaFusionToken/'
				}, 
				index: 1
			},
			{
				name: 'Tom Morris',
				role: 'Leading the PMT',
				photo: '/ico_dashboard/images/team_image_2.png',
				description: "Tom is a Sociologist who initially became interested in cryptography as an example of a change in social mood (emancipation from central bank debt slavery) and developed his involvement from there. He is responsible for coordinating the project's overall organisation in terms of product delivery and conformity to Whitepaper terms. He is also leading the PMT (see WP) with his main frame of reference being which cryptos are attractive and why from a change or evolution in 'social mood' perspective.",
				social_links: {
					twitter: 'https://twitter.com/MetaFusionToken',
					instagram: 'https://www.instagram.com/MetaFusionToken/'
				}, 
				index: 2
			},
			{
				name: 'Ekaterina Bulygina',
				role: 'Principle coordinator',
				photo: '/ico_dashboard/images/team_image_3.png',
				description: "Ekaterina is a graduate of Ulyanovsk University and is responsible for marketing and distribution. As a trained linguist, Ekaterina will also develop the product offering in other languages together with seeking promotion via various social media channels. She is also the principle coordinator with our distribution partner, Cyberinvest.",
				social_links: {
					twitter: 'https://twitter.com/MetaFusionToken',
					instagram: 'https://www.instagram.com/MetaFusionToken/'
				}, 
				index: 3
			}
		]
	}
}

var pov_object = {
		name: 'POV Coin',
		cover_photo: '/ico_dashboard/images/pov_cover.png',
		website_url: 'https://povcoin.io/',
		tag_line: 'A PLANET FOR ADULTS WITH ITS OWN RULES AND A NEW LEVEL OF PERCEPTION',
		description: 'While doing creative work and implementing their ideas via innovative IT technologies, each participant gets an opportunity to earn money. Using the growing VR market with the purpose to integrate it in POV and adult content by developing responsive adult toys. Sales promotion and preventing distribution of pirated content through engaging all the participants of the service, stealing does not make any sense, if one can earn by that',
		video_url: 'https://www.youtube.com/embed/gx9Tc_Nd-QY',
		js_file_url: 'https://ucarecdn.com/360fe536-9319-4fc7-8961-6e89b504e8f2/pov.js',
		current_sale_index: 0,
		social_links: {
			telegram: 'https://t.me/povcoin',
			twitter: 'https://twitter.com/povr_',
			instagram: 'https://www.instagram.com/povrproject/',
			facebook: 'https://www.facebook.com/povrproject/',
			youtube: 'https://www.youtube.com/channel/UCSJln51hIa_WZ2FcJpvdrLA',
			reddit: 'https://www.reddit.com/user/povr/'
		}, 
		whitepaper_url: 'https://povcoin.io/uploads/documents/wp(en).pdf',
		tags: ['ethereum', 'erc-20', 'adult', 'ico'],
		crowdsales: [
			{
			 	name: 'Public sale 1',
			 	start_date: '2018-12-22 12:00:00.853Z',
			 	end_date: '2019-1-22 12:00:00.853Z',
			 	total_tokens: 300000000,
			 	token_price: 0.00004,
			 	has_introducer: false,
			 }
		],
		token: {
			name: 'POV Coin',
			abbreviation: 'POV',
			total_supply: 300000000,
			contract_address: '0XD2590EE9446DA6AE102A7CBA322071ADE322E077',
			type: 'erc-20',
			logo_url: '/ico_dashboard/images/povcoin.png'
		},
		team: [
			{
				name: 'Sergey Zhilnikov',
				role: 'Internal manager',
				photo: '/ico_dashboard/images/pov_team_1.png',
				description: "Expert in information technology, more than 10 years professionally engaged in the development and management of commercial projects. Specialist in the field of system architecture and highly loaded systems. Blockchain Guru.",
				social_links: {
					linkedin: 'https://www.linkedin.com/in/sergey-zhilnikov-9b32076b/'
				}, 
				index: 1
			},
			{
				name: 'Chunosov Alexey',
				role: 'Leading the PMT',
				photo: '/ico_dashboard/images/pov_team_2.png',
				description: "The creator of the project, the inspirer of ideas and just a good person) Interaction with the Advisors and partners of the project, the search for contacts and organization of work",
				social_links: {
					linkedin: 'https://www.linkedin.com/in/alexey-chunosov-136452107'
				}, 
				index: 2
			},
			{
				name: 'Olga Suvorova',
				role: 'Principle coordinator',
				photo: '/ico_dashboard/images/pov_team_3.png',
				description: "I'm a financial project Director POVCOIN. I carry out strategic planning of financial policy and management of financial flows of our project.",
				social_links: {
					facebook: 'https://facebook.com/olya.suvorova.79'
				}, 
				index: 3
			}
		]
	}

exports.index = function(req, res){
	try{
		res.render('ico_dashboard/dashboard', pov_object);
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/index: ');
	}
};

exports.team = function(req, res){
	try{
		res.render('ico_dashboard/team', pov_object);
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

exports.community = function(req, res){
	try{
		res.render('ico_dashboard/community', pov_object);
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

exports.transactions = function(req, res){
	try{
		res.render('ico_dashboard/transactions', pov_object);
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};

exports.how_to = function(req, res){
	try{
		res.render('ico_dashboard/how-to', pov_object);
	} catch(e) {
		res.render('error', { 
			title: 'error',
			message: 'We couldnt find what you were looking for!',
			error: {
				status: 404
			}
		});
		
		errors.print(e, 'Error on server-side dashboard.js/team: ');
	}
};