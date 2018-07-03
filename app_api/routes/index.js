var express = require('express');
var router = express.Router();
var ctrlProjects = require('../controllers/projects');
var ctrlTokens = require('../controllers/tokens');
var ctrlCrowdsales = require('../controllers/crowdsales');

// projects
router.get('/projects', ctrlProjects.projectsListByStartTime);
router.post('/projects', ctrlProjects.projectsCreate);
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);
router.put('/projects/:projectid', ctrlProjects.projectssUpdateOne);
router.delete('/projects/:projectid', ctrlProjects.projectsDeleteOne);

// tokens
router.post('/projects/:projectid/token', ctrlTokens.tokenCreate);
router.get('/projects/:projectid/token', ctrlTokens.tokenRead);
router.put('/projects/:projectid/token', ctrlTokens.tokenUpdate);
router.delete('/projects/:projectid/token', ctrlTokens.tokenDelete);

// crowdsales
router.post('/projects/:projectid/crowdsales', ctrlCrowdsales.crowdsalesCreate);
router.get('/projects/:projectid/crowdsales/:crowdsaleid', ctrlCrowdsales.crowdsalesReadOne);
router.put('/projects/:projectid/crowdsales/:crowdsaleid', ctrlCrowdsales.crowdsalesUpdateOne);
router.delete('/projects/:projectid/crowdsales/:crowdsaleid', ctrlCrowdsales.crowdsalesDeleteOne);

module.exports = router;
