var express = require('express');
var router = express.Router();
var ctrlProjects = require('../controllers/projects');
var ctrlTokens = require('../controllers/tokens');
var ctrlCrowdsales = require('../controllers/crowdsales');
var ctrlContact = require('../controllers/contact');
var ctrlUser = require('../controllers/user');
var ctrlAdmin = require('../controllers/admin');
var ctrlContracts = require('../controllers/contracts');
const needsLogIn = require('./auth');
const onlyOwner = require('./onlyOwner');
const onlyAdmin = require('./onlyAdmin');
const tracking = require('../../tracking/tracking');

// All routes in this file will be prepended with /api as this is what calls this file from app.js
// This is used for adding users contact forms and subscriptions to the DB
router.post('/contact', tracking.apicall, ctrlContact.contact);
router.post('/subscribe', tracking.apicall, ctrlContact.subscribe);
router.post('/user', needsLogIn, tracking.apicall, ctrlUser.checkLogIn);
router.get('/user/:userid', needsLogIn, tracking.apicall, ctrlUser.checkRole);

// projects
router.get('/projects', needsLogIn, tracking.apicall, ctrlProjects.projectsListByStartTime);
router.post('/projects/create', needsLogIn, tracking.apicall, ctrlProjects.projectsCreate);
router.get('/projects/:projectid', tracking.apicall, ctrlProjects.projectsReadOne);
router.put('/projects/:projectid', needsLogIn, onlyOwner.require, tracking.apicall, ctrlProjects.projectssUpdateOne);
router.delete('/projects/:projectid', needsLogIn, onlyOwner.require, tracking.apicall, ctrlProjects.projectsDeleteOne);

// tokens
router.post('/projects/:projectid/token', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.tokenCreate);
router.get('/projects/:projectid/token', tracking.apicall, ctrlTokens.tokenRead);
router.put('/projects/:projectid/token', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.tokenUpdate);
router.delete('/projects/:projectid/token', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.tokenDelete);
router.post('/projects/:projectid/token/payment', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.getPrice);
router.put('/projects/:projectid/token/payment/confirm', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.paymentConfirm);
router.put('/projects/:projectid/token/payment/finalise', needsLogIn, onlyOwner.require, tracking.apicall, ctrlTokens.paymentFinalise);

// crowdsales
router.post('/projects/:projectid/crowdsales', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.crowdsalesCreate);
router.get('/projects/:projectid/crowdsales/:crowdsaleid', tracking.apicall, ctrlCrowdsales.crowdsalesReadOne);
router.get('/projects/:projectid/crowdsales/:crowdsaleid/toggleprogress', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.toggleProgress);
router.put('/projects/:projectid/crowdsales/:crowdsaleid', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.crowdsalesUpdateOne);
router.delete('/projects/:projectid/crowdsales/:crowdsaleid', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.crowdsalesDeleteOne);
router.post('/projects/:projectid/crowdsales/:crowdsaleid/payment', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.getPrice);
router.put('/projects/:projectid/crowdsales/:crowdsaleid/payment/confirm', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.paymentConfirmOne);
router.put('/projects/:projectid/crowdsales/:crowdsaleid/payment/finalise', needsLogIn, onlyOwner.require, tracking.apicall, ctrlCrowdsales.paymentFinaliseOne);
router.post('/projects/:projectid/crowdsales/:crowdsaleid/purchase', tracking.apicall, ctrlCrowdsales.recordPurchaseEmail);

// Admin
router.get('/admin/projects', needsLogIn, onlyAdmin.require, ctrlAdmin.projectsListByCreationTime);
router.get('/admin/subscriptions', needsLogIn, onlyAdmin.require, ctrlAdmin.getSubscriptions);
router.get('/admin/messages', needsLogIn, onlyAdmin.require, ctrlAdmin.getMessages);
router.post('/admin/messages/:messageid/responded', needsLogIn, onlyAdmin.require, ctrlAdmin.respondToMessage);
router.get('/admin/projects/:projectid/token/contract', needsLogIn, onlyAdmin.require, ctrlAdmin.getTokenContract);
router.get('/admin/projects/:projectid/crowdsale/:crowdsaleid/contract', needsLogIn, onlyAdmin.require, ctrlAdmin.getCrowdsaleContract);
router.post('/admin/projects/:projectid/token/contract', needsLogIn, onlyAdmin.require, ctrlAdmin.setTokenContract);
router.post('/admin/projects/:projectid/crowdsale/:crowdsaleid/contract', needsLogIn, onlyAdmin.require, ctrlAdmin.setCrowdsaleContract);

// Smart contracts
router.post('/contracts/crowdsale/basic', ctrlContracts.basicSale);
router.post('/contracts/token/transfers', ctrlContracts.tokenTransfers);
router.post('/contracts/token/holders', ctrlContracts.tokenHolders);


module.exports = router;
