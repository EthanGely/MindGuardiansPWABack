const express = require('express');
const Controller = require('../controllers/controllerDefault');

const RouterDefault = express.Router();

RouterDefault.get('/', Controller.default);


module.exports = RouterDefault;