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
		.populate({
			path: 'comment',
			populate: {
				path: 'createBy',
			},
		})
		.then((task) => {
			if (task.length < 1) {
				return res.status(404).json({
					error: { message: 'No department found' },
				});
			} else {
				task[0].comment.sort((a, b) => {
					return b.createAt - a.createAt;
				});
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
exports.getMyDepartmentTask = (req, res, next) => {
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
//OK
exports.deleteJob = (req, res, next) => {
	const jobId = req.body._id;
	let complete = '';
	const { id } = req.params;
	Task.findOneAndUpdate(
		{ _id: id },
		{ $pull: { smallJob: { _id: jobId } } },
		{
			new: true,
		}
	)
		.then((task) => {
			const thisState = task.smallJob.find((job) => {
				return job.state === false;
			});
			if (!thisState && task.smallJob.length > 0) {
				complete = new Date();
				Task.findOneAndUpdate(
					{ _id: id },
					{ state: true, completedDate: complete },
					{ new: true }
				)
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
			} else {
				Task.findOneAndUpdate(
					{ _id: id },
					{ state: false, completedDate: complete },
					{ new: true }
				)
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
			}
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

//OK
exports.changeJob = (req, res, next) => {
	const updateTask = req.body;
	let projectState = false;
	let completed = '';
	if (!updateTask.find((job) => job.state === false)) {
		projectState = true;
		completed = new Date();
	}
	const { id } = req.params;
	Task.findOneAndUpdate(
		{ _id: id },
		{ smallJob: updateTask, state: projectState, completedDate: completed },
		{
			new: true,
		}
	)
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
exports.addJob = (req, res, next) => {
	const { title } = req.body;
	const updateData = {
		_id: new mongoose.Types.ObjectId().toString(),
		title,
		state: false,
	};
	const { id } = req.params;
	Task.findOneAndUpdate(
		{ _id: id },
		{ state: false, $push: { smallJob: updateData }, completedDate: '' },
		{
			new: true,
		}
	)
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
	const assigneeIds = assignee.map((user) => {
		return user.id;
	});
	const startDate = new Date(initDate);
	const dueDate = new Date(expiredDate);
	const task = new Task({
		_id: new mongoose.Types.ObjectId(),
		name,
		department,
		assigner,
		assignee: assigneeIds,
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

//OK
exports.deleteTask = (req, res, next) => {
	const { taskId } = req.params;
	Task.deleteOne({ _id: taskId })
		.then((task) => {
			return res.status(200).json({
				msg: 'Task deleted successfully',
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: err.message,
			});
		});
};
