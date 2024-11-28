const express = require('express');
const Controller = require('../controllers/controllerChat');

const RouterDefault = express.Router();

RouterDefault.post('/getRooms', Controller.getRooms);
RouterDefault.post('/createRoom', Controller.createRoom);
//RouterDefault.post('/joinRoom', Controller.joinRoom);
RouterDefault.post('/getMessages', Controller.getMessages);
RouterDefault.post('/postMessage', Controller.postMessage);

module.exports = RouterDefault;
