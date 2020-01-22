const routes    = require('express').Router();
const verify    = require('../utils/verifyToken');
const authController = require('./controller');

routes.post('/register', authController.register);
routes.post('/login', authController.login);
routes.post('/forgot', authController.forgot);
routes.post('/changepass', verify, authController.changepass);

module.exports = routes;