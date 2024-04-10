const express = require('express');
const Controller = require('../controllers/controllerUser');


const RouterDefault = express.Router();

RouterDefault.post('/get', Controller.getUser);


module.exports = RouterDefault;