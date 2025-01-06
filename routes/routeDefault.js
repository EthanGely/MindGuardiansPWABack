const express = require('express');
const Controller = require('../controllers/controllerDefault');
const asyncHandler = require('../asyncHandler');

const RouterDefault = express.Router();

RouterDefault.get('/', asyncHandler(Controller.default));

module.exports = RouterDefault;
