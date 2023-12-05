require('dotenv').config();
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUser = (req, res, next) => {
	User.find()
		.select('_id firstName email date')
		.exec()
		.then((users) => {
			if (users.length <= 1) {
				return res.status(404).json({
					error: { message: 'No user found' },
				});
			} else {
				return res.status(200).json({
					Users: users,
				});
			}
		})
		.catch();
};

exports.loginUser = (req, res, next) => {
	User.find({ email: req.body.email })
		.then((user) => {
			if (user.length === 1) {
				bcrypt.compare(req.body.password, user[0].password, (err, result) => {
					if (err) {
						return res.status(401).json({
							error: { message: err.message },
						});
					}
					if (result) {
						const token = jwt.sign(
							{
								email: user[0].email,
								firstName: user[0].firstName,
							},
							process.env.JWT_SECRET_KEY
						);
						return res.status(200).json({
							data: {
								message: 'Login successfully',
								token: token,
							},
						});
					}
					return res.status(401).json({
						error: { message: 'Wrong password' },
					});
				});
			} else {
				return res.status(404).json({
					error: { message: 'User not found' },
				});
			}
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.registerUser = (req, res, next) => {
	//Find exist Email
	User.find({ email: req.body.email })
		.then((user) => {
			if (user.length === 0) {
				//ENCODE password
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: { message: err.message },
						});
					} else {
						const users = new User({
							_id: new mongoose.Types.ObjectId(),
							firstName: req.body.firstName,
							email: req.body.email,
							password: hash,
						});
						users.save().then((result) => {
							return res.status(201).json({ User: result });
						});
					}
				});
				return res.status(422).json({
					error: {
						message: 'Parameters dont meet requirement',
					},
				});
			} else {
				return res.status(409).json({
					error: { message: 'Existed' },
				});
			}
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.deleteAll = (req, res, next) => {
	User.find({})
		.deleteMany()
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.changeInfo = (req, res, next) => {
	User.findOneAndUpdate({ email: req.userData.email }, req.body)
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

exports.getInfo = (req, res, next) => {
	User.find({ email: req.userData.email })
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

exports.deleteMe = (req, res, next) => {
	User.deleteOne({ email: req.userData.email })
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
