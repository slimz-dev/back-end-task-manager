const express = require('express');
const router = express.Router();
const personalTaskController = require('../controllers/PersonalTask');
const tokenVerify = require('../middleware/tokenVerify');
// GET all users
router.get('/', personalTaskController.getAllTask);
router.get('/:id', personalTaskController.getMyTask);
router.post('/:id', personalTaskController.addTask);
router.patch('/:id', personalTaskController.changeTaskState);

module.exports = router;
