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
		.populate({
			path: 'notification',
			populate: [
				{
					path: 'departmentId',
				},
				{ path: 'taskId', select: 'name' },
			],
		})
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
						let unreadNotifications = 0;
						notification.notification.forEach((noti) => {
							if (!noti.read) {
								unreadNotifications += 1;
							}
						});
						return res.status(200).json({
							data: notification,
							meta: {
								numbers: unreadNotifications,
							},
						});
					})
					.catch((err) => {
						return res.status(500).json({
							msg: err.message,
						});
					});
			} else {
				let unreadNotifications = 0;
				notification.notification.forEach((noti) => {
					if (!noti.read) {
						unreadNotifications += 1;
					}
				});
				return res.status(200).json({
					data: notification,
					meta: {
						numbers: unreadNotifications,
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
	const currentDate = new Date();
	const { departmentId, taskId } = req.body;
	Notification.findOne({ _id: userId })
		.select()
		.exec()
		.then((notification) => {
			//NOT EXISTED
			if (notification === null) {
				const notification = new Notification({
					_id: userId,
					notification: [
						{
							_id: new mongoose.Types.ObjectId().toString(),
							read: false,
							departmentId: departmentId,
							taskId: taskId,
							createdAt: currentDate,
						},
					],
				});
				notification
					.save()
					.then((notification) => {
						//PUSH FRONT END
						Notification.findOne({ _id: userId })
							.select()
							.populate({
								path: 'notification',
								populate: [
									{
										path: 'departmentId',
									},
									{ path: 'taskId', select: 'name' },
								],
							})
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
					})
					.catch((err) => {
						return res.status(500).json({
							msg: err.message,
						});
					});
			} else {
				//EXISTED
				console.log('existed');
				Notification.findOneAndUpdate(
					{ _id: userId },
					{
						$push: {
							notification: {
								_id: new mongoose.Types.ObjectId().toString(),
								read: false,
								departmentId: departmentId,
								taskId: taskId,
								createdAt: currentDate,
							},
						},
					},
					{ new: true }
				)
					.then((notification) => {
						console.log('push front end');
						//PUSH FRONT END
						Notification.findOne({ _id: userId })
							.select()
							.populate({
								path: 'notification',
								populate: [
									{
										path: 'departmentId',
									},
									{ path: 'taskId', select: 'name' },
								],
							})
							.then((notification) => {
								let unreadNotifications = 0;
								notification.notification.forEach((noti) => {
									if (!noti.read) {
										unreadNotifications += 1;
									}
								});
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
					})
					.catch((err) => {
						return res.status(500).json({
							msg: err.message,
						});
					});
			}
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
