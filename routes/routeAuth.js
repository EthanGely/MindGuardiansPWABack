const express = require('express');
const Controller = require('../controllers/controllerAuth');

const RouterDefault = express.Router();

RouterDefault.post('/login', Controller.login);
RouterDefault.post('/signin', Controller.signin);
RouterDefault.post('/checkToken', Controller.checkToken);

module.exports = RouterDefault;
