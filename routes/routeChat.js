const express = require('express');
const Controller = require('../controllers/controllerChat');
const asyncHandler = require('../asyncHandler');

const RouterDefault = express.Router();

RouterDefault.post('/getRooms', asyncHandler(Controller.getRooms));
RouterDefault.post('/createRoom', asyncHandler(Controller.createRoom));
//RouterDefault.post('/joinRoom', asyncHandler(Controller.joinRoom));
RouterDefault.post('/getMessages', asyncHandler(Controller.getMessages));
RouterDefault.post('/postMessage', asyncHandler(Controller.postMessage));

module.exports = RouterDefault;
