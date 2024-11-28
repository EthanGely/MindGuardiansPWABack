const express = require('express');
const controllerAgendaValidation = require('../controllers/controllerAgendaValidation');

const RouterAgendaValidation = express.Router();

RouterAgendaValidation.post('/getAll', controllerAgendaValidation.getAll);
RouterAgendaValidation.post('/get', controllerAgendaValidation.get);
RouterAgendaValidation.post('/create', controllerAgendaValidation.create);
RouterAgendaValidation.post('/delete', controllerAgendaValidation.delete);

module.exports = RouterAgendaValidation;
