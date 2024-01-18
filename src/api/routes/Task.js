const express = require('express');
const router = express.Router();
const taskController = require('../controllers/Task');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');
// GET total departments

// router.get('/', tokenVerify, permissionVerify, taskController.getDepartmentTask);

//GET select department tasks
router.get(
	'/department/:id',
	tokenVerify,
	permissionVerify('globalTaskManager', ['create']),
	taskController.getDepartmentTask
);

//GET my department tasks
router.get(
	'/department/my/:id',
	tokenVerify,
	permissionVerify('localTaskManager', ['read']),
	taskController.getMyDepartmentTask
);
//GET select task
router.get('/department/:id/:taskId', tokenVerify, taskController.getTask);
// // DELETE 1 department
// router.delete('/:id', tokenVerify, permissionVerify, taskController.deleteDepartment);
// // PATCH department
// router.patch('/:id', tokenVerify, permissionVerify, taskController.changeDepartment);

// POST new task
router.post(
	'/new',
	tokenVerify,
	permissionVerify('localTaskManager', ['create']),
	taskController.newTask
);
//POST change state job
router.post('/:id', tokenVerify, taskController.changeJob);
//POST new job
router.post(
	'/:id/job',
	tokenVerify,
	permissionVerify('localTaskManager', ['update']),
	taskController.addJob
);

//PATCH delete job
router.patch(
	'/:id/job',
	tokenVerify,
	permissionVerify('localTaskManager', ['update']),
	taskController.deleteJob
);

//DELETE task
router.delete(
	'/:taskId',
	tokenVerify,
	permissionVerify('localTaskManager', ['delete']),
	taskController.deleteTask
);
module.exports = router;
