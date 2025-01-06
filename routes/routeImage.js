const express = require('express');
const ControllerImage = require('../controllers/controllerImage');
const asyncHandler = require('../asyncHandler');

const RouterImage = express.Router();

RouterImage.post('/getAll', asyncHandler(ControllerImage.getAllForUser));
/*
RouterImage.post('/get', asyncHandler(ControllerImage.get));
RouterImage.post('/delete', asyncHandler(ControllerImage.delete));
RouterImage.post('/update', asyncHandler(ControllerImage.update));*/

module.exports = RouterImage;
