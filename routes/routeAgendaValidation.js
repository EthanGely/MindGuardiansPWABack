const express = require('express');
const controllerAgendaValidation = require('../controllers/controllerAgendaValidation');
const asyncHandler = require('../asyncHandler');

const RouterAgendaValidation = express.Router();

RouterAgendaValidation.post('/getAll', asyncHandler(controllerAgendaValidation.getAll));
RouterAgendaValidation.post('/get', asyncHandler(controllerAgendaValidation.get));
RouterAgendaValidation.post('/create', asyncHandler(controllerAgendaValidation.create));
RouterAgendaValidation.post('/delete', asyncHandler(controllerAgendaValidation.delete));

module.exports = RouterAgendaValidation;
