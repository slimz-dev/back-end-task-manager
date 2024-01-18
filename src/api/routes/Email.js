const express = require('express');
const router = express.Router();
const emailController = require('../controllers/Email');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');

// POST new department
router.post('/send', tokenVerify, permissionVerify('invite', ['create']), emailController.newEmail);

module.exports = router;
