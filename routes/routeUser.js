const express = require('express');
const Controller = require('../controllers/controllerUser');

const RouterUser = express.Router();

RouterUser.post('/getCurrent', Controller.getUser);

module.exports = RouterUser;
