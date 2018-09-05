var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var needsLogIn = require('./auth');
var onlyAdmin = require('./onlyAdmin');

// All routes in this file will be prepended with /api as this is what calls this file from app.js
// This is used for adding users contact forms and subscriptions to the DB
router.get('/', needsLogIn, ctrlMain.index);
router.get('/projects', needsLogIn,  ctrlMain.projects);
router.get('/projects/:projectname', needsLogIn,  ctrlMain.projectReadOne);

router.post('/messages/:messageid', needsLogIn,  ctrlMain.messageResponded);
router.post('/projects/:projectname/token/contract', needsLogIn,  ctrlMain.doTokenContractCreation);
router.post('/projects/:projectname/crowdsales/:saleid/contract', needsLogIn,  ctrlMain.doSaleContractCreation);

module.exports = router;
