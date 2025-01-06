const express = require('express');
const Controller = require('../controllers/controllerRole');
const asyncHandler = require('../asyncHandler');

const RouterDefault = express.Router();

RouterDefault.get('/getAll', asyncHandler(Controller.getAll));

module.exports = RouterDefault;
