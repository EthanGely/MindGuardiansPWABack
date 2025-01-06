const express = require('express');
const Controller = require('../controllers/controllerPushNotif');
const asyncHandler = require('../asyncHandler');

const RouterDefault = express.Router();

RouterDefault.get('/service-worker.js', Controller.serviceWorker);
RouterDefault.get('/vpk', Controller.vpk);
RouterDefault.get('/register', asyncHandler(Controller.register));

module.exports = RouterDefault;
