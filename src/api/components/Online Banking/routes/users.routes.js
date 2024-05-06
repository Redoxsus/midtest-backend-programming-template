const express = require('express');
const usersController = require('../controllers/users.controller');

const route = express.Router();

route.post('/', usersController.createUser);
route.get('/:id/balance', usersController.getUserBalance);
route.put('/:id/balance', usersController.updateUserBalance);

module.exports = route;
