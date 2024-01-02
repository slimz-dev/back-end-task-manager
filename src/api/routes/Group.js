const express = require('express');
const router = express.Router();
const groupController = require('../controllers/Group');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');
// GET total groups
router.get('/', tokenVerify, permissionVerify, groupController.getTotalGroups);
// DELETE ALL groups
router.delete('/', tokenVerify, permissionVerify, groupController.deleteTotal);

//GET 1 group
router.get('/:id', tokenVerify, permissionVerify, groupController.getGroup);
// DELETE 1 group
router.delete('/:id', tokenVerify, permissionVerify, groupController.deleteGroup);
// PATCH user
router.patch('/:id', tokenVerify, permissionVerify, groupController.changeGroup);

// POST new group
router.post('/new', tokenVerify, permissionVerify, groupController.newGroup);

// DELETE multiple group
router.delete('/multiple', tokenVerify, permissionVerify, groupController.deleteMultipleGroup);

module.exports = router;
