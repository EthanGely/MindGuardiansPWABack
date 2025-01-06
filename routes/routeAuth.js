const express = require('express');
const Controller = require('../controllers/controllerAuth');
const asyncHandler = require('../asyncHandler');

const RouterDefault = express.Router();

RouterDefault.post('/login', asyncHandler(Controller.login));
RouterDefault.post('/signin', asyncHandler(Controller.signin));
RouterDefault.post('/checkToken', asyncHandler(Controller.checkToken));

module.exports = RouterDefault;
