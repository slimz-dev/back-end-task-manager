require('dotenv').config();
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//OK
exports.getAllComment = (req, res, next) => {
	Comment.find({})
		.select()
		.exec()
		.then((comment) => {
			if (comment.length < 1) {
				return res.status(404).json({
					error: { message: 'No comment found' },
				});
			} else {
				return res.status(200).json({
					data: comment,
					meta: {
						numbers: comment.length,
					},
				});
			}
		})
		.catch();
};

//OK
exports.newComment = (req, res, next) => {
	const { taskId } = req.params;
	const { content, createBy } = req.body;
	const date = new Date();
	const comment = new Comment({
		_id: new mongoose.Types.ObjectId().toString(),
		content,
		createBy,
		createAt: date,
	});
	comment
		.save()
		.then((comment) => {
			Task.findOneAndUpdate(
				{ _id: taskId },
				{ $push: { comment: comment } },
				{
					new: true,
				}
			)
				.then((task) => {
					return res.status(200).json({
						data: task,
					});
				})
				.catch((err) => {
					return res.status(500).json({ message: err.message });
				});
		})
		.catch((err) => {
			return res.status(500).json({ message: err.message });
		});
};

exports.deleteAllComment = (req, res, next) => {
	const { id } = req.params;
	Task.findOneAndUpdate({}, { comment: [] }, { new: true })
		.then((task) => {
			Comment.deleteMany({}).then((comment) => {
				return res.status(200).json({
					msg: 'Comments deleted successfully',
				});
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: err.message,
			});
		});
};
