require('dotenv').config();
const Comment = require('../models/Comment');
// const Task = require('../models/Task');
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
	const comment = new Comment({
		_id: new mongoose.Types.ObjectId().toString(),
		content,
		createBy,
	});
	comment.save().then((comment) => {
		console.log(comment);
		return res.status(200).json({
			data: comment,
		});
	});
};
