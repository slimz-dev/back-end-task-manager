const User = require('../models/User');
const PersonalTask = require('../models/PersonalTask');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

exports.getAllTask = (req, res, next) => {
	User.find({})
		.populate('role', 'name')
		.populate('department', 'name')
		.select('_id firstName lastName email img biography phone role department')
		.exec()
		.then((users) => {
			if (users.length < 1) {
				return res.status(404).json({
					error: { message: 'No user found' },
				});
			} else {
				return res.status(200).json({
					data: users,
					meta: {
						numbers: users.length,
					},
				});
			}
		})
		.catch();
};

exports.getMyTask = (req, res, next) => {
	const { id } = req.params;
	PersonalTask.find({ _id: id })
		.then((result) => {
			return res.status(200).json({
				data: result,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: {
					message: err.message,
				},
			});
		});
};

exports.addTask = (req, res, next) => {
	const { id } = req.params;
	const updateData = req.body;
	PersonalTask.find({ _id: id })
		.then((result) => {
			if (result.length === 0) {
				const personalTask = new PersonalTask({
					_id: id,
					task: [],
				});
				personalTask
					.save()
					.then((result) => {
						PersonalTask.findOneAndUpdate(
							{ _id: id },
							{
								$push: {
									task: {
										...updateData,
										_id: new mongoose.Types.ObjectId().toString(),
									},
								},
							},
							{ new: true }
						)
							.then((result) => {
								return res.status(201).json({
									data: result,
								});
							})
							.catch((err) => {
								return res.status(500).json({
									message: err.message,
								});
							});
					})
					.catch((err) => {
						return res.status(500).json({
							message: err.message,
						});
					});
			} else {
				PersonalTask.findOneAndUpdate(
					{ _id: id },
					{
						$push: {
							task: {
								...updateData,
								_id: new mongoose.Types.ObjectId().toString(),
							},
						},
					},
					{ new: true }
				)
					.then((result) => {
						return res.status(201).json({
							data: result,
						});
					})
					.catch((err) => {
						return res.status(500).json({
							message: err.message,
						});
					});
			}
		})
		.catch((err) => {
			return res.status(500).json({
				error: {
					message: err.message,
				},
			});
		});
};

exports.changeTaskState = (req, res, next) => {
	const updateData = req.body;
	const { id } = req.params;
	PersonalTask.findOneAndUpdate({ _id: id }, { task: updateData }, { new: true })
		.then((task) => {
			return res.status(200).json({
				data: task,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: err.message,
			});
		});
};
