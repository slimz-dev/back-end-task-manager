const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const tokenVerify = require('../middleware/tokenVerify');
// GET all users
router.get('/', userController.getAllUser);

// POST login  user
router.post('/login', userController.loginUser);

// POST register user
router.post('/register', userController.registerUser);

// DELETE ALL user
router.delete('/', userController.deleteAll);

//GET my info
router.get('/me', tokenVerify, userController.getInfo);

// PATCH user
router.patch('/me', tokenVerify, userController.changeInfo);
router.patch('/me/password', tokenVerify, userController.changePassword);

// DELETE 1 user
router.delete('/me', tokenVerify, userController.deleteMe);

module.exports = router;
