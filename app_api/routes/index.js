var express = require('express');
var router = express.Router();
var ctrlProjects = require('../controllers/projects');
var ctrlTokens = require('../controllers/tokens');
var ctrlCrowdsales = require('../controllers/crowdsales');
const needsLogIn = require('./auth');
const onlyOwner = require('./onlyOwner');

// All routes in this file will be prepended with /api as this is what calls this file from app.js
// projects
router.get('/projects', needsLogIn, ctrlProjects.projectsListByStartTime);
router.post('/projects/create', needsLogIn, ctrlProjects.projectsCreate);
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);
router.put('/projects/:projectid', needsLogIn, onlyOwner.require, ctrlProjects.projectssUpdateOne);
router.delete('/projects/:projectid', needsLogIn, onlyOwner.require, ctrlProjects.projectsDeleteOne);

// tokens
router.post('/projects/:projectid/token', needsLogIn, onlyOwner.require, ctrlTokens.tokenCreate);
router.get('/projects/:projectid/token', ctrlTokens.tokenRead);
router.put('/projects/:projectid/token', needsLogIn, onlyOwner.require, ctrlTokens.tokenUpdate);
router.delete('/projects/:projectid/token', needsLogIn, onlyOwner.require, ctrlTokens.tokenDelete);
router.post('/projects/:projectid/token/payment', needsLogIn, onlyOwner.require, ctrlTokens.getPrice);
router.put('/projects/:projectid/token/payment/confirm', needsLogIn, onlyOwner.require, ctrlTokens.paymentConfirm);
router.put('/projects/:projectid/token/payment/finalise', needsLogIn, onlyOwner.require, ctrlTokens.paymentFinalise);

// crowdsales
router.post('/projects/:projectid/crowdsales', needsLogIn, onlyOwner.require, ctrlCrowdsales.crowdsalesCreate);
router.get('/projects/:projectid/crowdsales/:crowdsaleid', ctrlCrowdsales.crowdsalesReadOne);
router.put('/projects/:projectid/crowdsales/:crowdsaleid', needsLogIn, onlyOwner.require, ctrlCrowdsales.crowdsalesUpdateOne);
router.delete('/projects/:projectid/crowdsales/:crowdsaleid', needsLogIn, onlyOwner.require, ctrlCrowdsales.crowdsalesDeleteOne);
router.post('/projects/:projectid/crowdsales/:crowdsaleid/payment', needsLogIn, onlyOwner.require, ctrlCrowdsales.getPrice);
router.put('/projects/:projectid/crowdsales/:crowdsaleid/payment/confirm', needsLogIn, onlyOwner.require, ctrlCrowdsales.paymentConfirmOne);
router.put('/projects/:projectid/crowdsales/:crowdsaleid/payment/finalise', needsLogIn, onlyOwner.require, ctrlCrowdsales.paymentFinaliseOne);

module.exports = router;
