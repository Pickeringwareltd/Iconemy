var express = require('express');

exports.index = function(req, res){
	res.render('project_interaction', { 
		title: 'Project',
		projectInfo: {
			name: 'Donut',
			description: 'This is a basic description of your project, its aim is to instantly engage your audience and encourage them to look into further detail about what your project aims to do.',
			website: 'https://www.donut.io',
			whitepaper: 'https://www.donut.io/whitepaper',
			onepager: 'https://www.donut.io/onepager',
			logo: 'images/donut_logo_large.png',
			subdomain: 'donut',
			social: {
				facebook: 'https://www.facebook.com/donut',
				twitter: 'https://www.twitter.com/donut', 
				youtube: 'https://www.youtube.com/donut',
				github: 'https://www.github.com/donut',
				bitcointalk: 'https://www.bitcointalk.com/donut',
				medium: 'https://www.medium.com/donut' 
			},
			token: {
				name: 'Donut token',
				symbol: 'DNT',
				link: 'https://www.iconemy.io/token',
				logo: 'images/donut_logo.png'
			},
			crowdsales: [{
				name: 'Public-sale',
				status: 'On-going',
				start: '1/1/19',
				end: '1/6/19',
				price: 0.0014,
				sold: 1234567,
				investors: 1234
			},
			{
				name: 'Pre-sale 2',
				status: 'Ended',
				start: '25/9/18',
				end: '25/11/18',
				price: 0.0012,
				sold: 234567,
				investors: 234
			},
			{
				name: 'Pre-sale 1',
				status: 'Ended',
				start: '12/6/18',
				end: '12/8/18',
				price: 0.001,
				sold: 4567,
				investors: 34
			}]
		}
	});
};

exports.create = function(req, res){
	res.render('create_project', { 
		title: 'Create project'
	});
};

exports.myprojects = function(req, res){
	res.render('my_projects', { 
		title: 'My projects',
		crowdsales: [{
			id: 'donut',
			name: 'Donut',
			description: 'Donut is a decentralised advertising network, it allow users to earn money while they browse!',
			link: 'https://www.donut.io',
			image: 'images/donut_logo_large.png'
		},{
			id: 'resauce',
			name: 'Resauce',
			description: 'Resauce is a social educational network aiming to allow any student to learn any lesson for free.',
			link: 'https://www.resauce.io',
			image: 'images/resauce_logo.png'
		}]
	});
};