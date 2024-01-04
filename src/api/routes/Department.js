const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/Department');
const tokenVerify = require('../middleware/tokenVerify');
const permissionVerify = require('../middleware/permissionVerify');
// GET total departments
router.get('/', tokenVerify, permissionVerify, departmentController.getTotalDepartments);

//GET 1 department
router.get('/:id', tokenVerify, permissionVerify, departmentController.getDepartment);
// DELETE 1 department
router.delete('/:id', tokenVerify, permissionVerify, departmentController.deleteDepartment);
// PATCH department
router.patch('/:id', tokenVerify, permissionVerify, departmentController.changeDepartment);

// POST new department
router.post('/new', tokenVerify, permissionVerify, departmentController.newDepartment);

module.exports = router;
