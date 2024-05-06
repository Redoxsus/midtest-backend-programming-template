const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/', usersController.createUser);
router.get('/:id/balance', usersController.getUserBalance);
router.put('/:id/balance', usersController.updateUserBalance);

module.exports = router;
