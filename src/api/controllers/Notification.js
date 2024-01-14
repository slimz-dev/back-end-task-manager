require('dotenv').config();
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//OK
exports.getMyNotification = (req, res, next) => {
	const { userId } = req.params;
	Notification.findOne({ _id: userId })
		.select()
		.exec()
		.then((notification) => {
			if (notification === null) {
				const notification = new Notification({
					_id: userId,
					notification: [],
				});
				notification
					.save()
					.then((notification) => {
						return res.status(200).json({
							data: notification,
							meta: {
								numbers: notification.notification.length,
							},
						});
					})
					.catch((err) => {
						return res.status(500).json({
							msg: err.message,
						});
					});
			} else {
				return res.status(200).json({
					data: notification,
					meta: {
						numbers: notification.notification.length,
					},
				});
			}
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};

exports.pushMyNotification = (req, res, next) => {
	const { userId } = req.params;
	const { departmentId, taskId } = req.body;
	Notification.findOneAndUpdate(
		{ _id: userId },
		{
			$push: {
				notification: {
					_id: new mongoose.Types.ObjectId.toString(),
					read: false,
					departmentId: departmentId,
					taskId: taskId,
				},
			},
		},
		{ new: true }
	)
		.then((notification) => {
			return res.status(200).json({
				data: notification,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};

exports.deleteMyNotification = (req, res, next) => {
	const { userId } = req.params;
	Notification.findOneAndUpdate(
		{ _id: userId },
		{
			notification: [],
		},
		{ new: true }
	)
		.then((notification) => {
			return res.status(200).json({
				data: notification,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};
