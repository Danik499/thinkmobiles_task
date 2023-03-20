const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
    .delete(userController.deleteAllUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/login')
    .post(userController.login);

module.exports = router;