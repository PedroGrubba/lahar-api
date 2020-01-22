const routes    = require('express').Router();
const apiController = require('./controllers');
const verifyToken   = require('../utils/verifyToken');

routes.get('/hello', apiController.helloWord);
routes.post('/login', apiController.login);
routes.post('/leads', apiController.getLeadsLahar);
//routes.get('/getlinkdrive/:idSalesforce', verifyToken, apiController.getLinkDrive);

module.exports = routes;