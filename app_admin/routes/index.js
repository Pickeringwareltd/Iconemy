var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

// All routes in this file will be prepended with /api as this is what calls this file from app.js
// This is used for adding users contact forms and subscriptions to the DB
router.get('/', ctrlMain.index);
router.get('/projects', ctrlMain.projects);
router.get('/projects/:projectname', ctrlMain.projectReadOne);

module.exports = router;
