const express = require('express');
const router = express.Router();
const groupController = require('../controllers/Group');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');
// GET total groups

router.get(
	'/',
	tokenVerify,
	permissionVerify('admin', ['create', 'read', 'update', 'delete']),
	groupController.getTotalGroups
);
// DELETE multiple groups
router.delete('/', tokenVerify, groupController.deleteMultipleGroup);

//GET 1 group
router.get('/:id', tokenVerify, groupController.getGroup);
// DELETE 1 group
router.delete(
	'/:id',
	tokenVerify,
	permissionVerify('admin', ['delete']),
	groupController.deleteGroup
);
// PATCH user
router.patch(
	'/:id',
	tokenVerify,
	permissionVerify('admin', ['update']),
	groupController.changeGroup
);

// POST new group
router.post('/new', tokenVerify, permissionVerify('admin', ['create']), groupController.newGroup);

module.exports = router;
