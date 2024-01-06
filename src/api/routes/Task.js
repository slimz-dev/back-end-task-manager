const express = require('express');
const router = express.Router();
const taskController = require('../controllers/Task');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');
// GET total departments

router.get('/', tokenVerify, permissionVerify, taskController.getDepartmentTask);

//GET my department tasks
router.get('/department/:id', tokenVerify, permissionVerify, taskController.getDepartmentTask);

//GET select task
router.get('/department/:id/:taskId', tokenVerify, permissionVerify, taskController.getTask);
// // DELETE 1 department
// router.delete('/:id', tokenVerify, permissionVerify, taskController.deleteDepartment);
// // PATCH department
// router.patch('/:id', tokenVerify, permissionVerify, taskController.changeDepartment);

// POST new task
router.post('/new', tokenVerify, permissionVerify, taskController.newTask);

module.exports = router;
