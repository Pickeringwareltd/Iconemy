var express = require('express');

exports.index = function(req, res){
	res.render('project_interaction', { title: 'Project' });
};

exports.create = function(req, res){
	res.render('create_project', { title: 'Create project' });
};

exports.myprojects = function(req, res){
	res.render('my_projects', { title: 'My projects' });
};