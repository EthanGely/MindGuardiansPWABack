const express = require('express');
const Controller = require('../controllers/controllerRole');


const RouterDefault = express.Router();

RouterDefault.get('/getAll', Controller.getAll);


module.exports = RouterDefault;