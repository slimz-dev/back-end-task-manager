const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const tokenVerify = require('../middleware/tokenVerify');
const emailVerify = require('../middleware/emailVerify');
// GET all users
router.get('/', userController.getAllUser);
router.get('/department/:id', userController.getMyDepartment);
router.get('/search', userController.getSearchUser);
// POST login  user
router.post('/login', userController.loginUser);

// POST register user
router.post('/register/:token', emailVerify, userController.registerUser);

// DELETE ALL user
router.delete('/', userController.deleteAll);

//GET my info
router.get('/me', tokenVerify, userController.getInfo);

// PATCH user
router.patch('/me', tokenVerify, userController.changeInfo);

//CHANGE password
router.patch('/me/password', tokenVerify, userController.changePassword);

//ADD department + role
router.patch('/assign/:id', tokenVerify, userController.changeGroup);
//DELETE department
router.patch('/:id/remove', tokenVerify, userController.deleteDepartment);

// DELETE 1 user
router.delete('/me', tokenVerify, userController.deleteMe);

module.exports = router;
