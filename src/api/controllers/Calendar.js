require('dotenv').config();
const Comment = require('../models/Comment');
const Calendar = require('../models/Calendar');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//OK
exports.getAllCalendar = (req, res, next) => {
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
exports.getMyCalendar = (req, res, next) => {
	const { userId } = req.params;
	Calendar.findOne({ _id: userId })
		.then((calendar) => {
			if (calendar !== null) {
				return res.status(200).json({
					data: calendar,
				});
			} else {
				const calendar = new Calendar({
					_id: userId,
					calendar: [],
				});
				calendar.save().then((calendar) => {
					return res.status(200).json({
						data: calendar,
					});
				});
			}
		})
		.catch((err) => {
			return res.status(500).json({ message: err.message });
		});
};

// //OK
exports.newCalendar = (req, res, next) => {
	const { userId } = req.params;
	const data = req.body;
	console.log(data);
	Calendar.find({ _id: userId })
		.then((calendar) => {
			if (calendar.length !== 0) {
				Calendar.findOneAndUpdate(
					{ _id: userId },
					{
						$push: {
							calendar: {
								_id: new mongoose.Types.ObjectId(),
								...data,
							},
						},
					},
					{ new: true }
				)
					.then((calendar) => {
						return res.status(200).json({
							data: calendar,
						});
					})
					.catch((err) => {
						return res.status(500).json({
							message: err.message,
						});
					});
			} else {
				const newCalendar = new Calendar({
					_id: userId,
					calendar: [
						{
							_id: new mongoose.Types.ObjectId(),
							...data,
						},
					],
				});
				newCalendar
					.save()
					.then((result) => {
						return res.status(200).json({
							data: result,
						});
					})
					.catch((err) => {
						return res.status(400).json({
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

//OK
exports.deleteCalendar = (req, res, next) => {
	Calendar.deleteOne({})
		.then((calendar) => {
			return res.status(200).json({
				msg: 'Delete successfully',
			});
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};

exports.deleteCurrentCalendar = (req, res, next) => {
	const { userId } = req.params;
	const calendarId = req.body;
	console.log(calendarId);
	Calendar.findOneAndUpdate(
		{ _id: userId },
		{
			$pull: {
				calendar: calendarId,
			},
		},
		{ new: true }
	)
		.then((calendar) => {
			return res.status(200).json({
				data: calendar,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};
