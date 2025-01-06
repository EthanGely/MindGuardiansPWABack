const express = require('express');
const ControllerAgenda = require('../controllers/controllerAgenda');
const asyncHandler = require('../asyncHandler');

const RouterAgenda = express.Router();

RouterAgenda.post('/getAll', asyncHandler(ControllerAgenda.getAllForUser));
RouterAgenda.post('/get', asyncHandler(ControllerAgenda.get));
RouterAgenda.post('/create', asyncHandler(ControllerAgenda.create));
RouterAgenda.post('/delete', asyncHandler(ControllerAgenda.delete));
RouterAgenda.post('/update', asyncHandler(ControllerAgenda.update));

module.exports = RouterAgenda;
