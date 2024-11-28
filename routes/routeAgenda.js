const express = require('express');
const ControllerAgenda = require('../controllers/controllerAgenda');

const RouterAgenda = express.Router();

RouterAgenda.post('/getAll', ControllerAgenda.getAllForUser);
RouterAgenda.post('/get', ControllerAgenda.get);
RouterAgenda.post('/create', ControllerAgenda.create);
RouterAgenda.post('/delete', ControllerAgenda.delete);
RouterAgenda.post('/update', ControllerAgenda.update);

module.exports = RouterAgenda;
