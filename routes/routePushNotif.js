const express = require('express');
const Controller = require('../controllers/controllerPushNotif');

const RouterDefault = express.Router();

RouterDefault.get('/service-worker.js', Controller.serviceWorker);
RouterDefault.get('/vpk', Controller.vpk);
RouterDefault.get('/register', Controller.register);

module.exports = RouterDefault;
