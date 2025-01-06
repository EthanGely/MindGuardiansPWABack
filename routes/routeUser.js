const express = require('express');
const Controller = require('../controllers/controllerUser');
const asyncHandler = require('../asyncHandler');

const RouterUser = express.Router();

RouterUser.post('/getCurrent', asyncHandler(Controller.getUser));
RouterUser.post('/getAllForDoctor', asyncHandler(Controller.getUsersForDoctor));
RouterUser.post('/getForDoctor', asyncHandler(Controller.getUserForDoctor));

module.exports = RouterUser;
