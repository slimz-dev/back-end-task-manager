require('dotenv').config();
const Task = require('../models/Task');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//OK
exports.getTask = (req, res, next) => {
	const { taskId } = req.params;
	Task.find({ _id: taskId })
		.populate('assigner', 'firstName lastName img')
		.populate('assignee', 'firstName lastName img')
		.then((task) => {
			if (task.length < 1) {
				return res.status(404).json({
					error: { message: 'No department found' },
				});
			} else {
				return res.status(200).json({
					data: task,
					meta: {
						numbers: task.length,
					},
				});
			}
		})
		.catch();
};
//OK
exports.getDepartmentTask = (req, res, next) => {
	const { id } = req.params;
	Task.find({ department: id })
		.populate('department', 'name')
		.populate('assigner', 'firstName lastName img')
		.populate('assignee', 'firstName lastName img')
		.then((task) => {
			return res.status(200).json({
				data: task,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.deleteTask = (req, res, next) => {
	const { id } = req.params;
	Department.findOneAndDelete({ _id: id })
		.then((response) => {
			return res.status(200).json({
				data: response,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.changeTask = (req, res, next) => {
	const updateDepartment = req.body;
	const { id } = req.params;
	Department.findOneAndUpdate({ _id: id }, updateDepartment, {
		new: true,
	})
		.then((response) => {
			return res.status(200).json({
				data: response,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

//OK
exports.newTask = (req, res, next) => {
	const { name, department, assigner, assignee, description, initDate, expiredDate } = req.body;
	const startDate = new Date(initDate);
	const dueDate = new Date(expiredDate);
	const task = new Task({
		_id: new mongoose.Types.ObjectId(),
		name,
		department,
		assigner,
		assignee,
		description,
		initDate: startDate,
		expiredDate: dueDate,
	});
	task.save()
		.then((result) => {
			return res.status(201).json({ data: result });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};
