require('dotenv').config();
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

exports.getAllUser = (req, res, next) => {
	User.find({})
		.select('_id firstName lastName email img biography phone')
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

exports.loginUser = (req, res, next) => {
	const { email, userName, password } = req.body;
	const account = email ? email : userName;
	const field = email === undefined ? 'userName' : 'email';
	User.find({ [field]: account })
		.then((user) => {
			console.log(field, account);
			if (user.length === 1) {
				bcrypt.compare(password, user[0].password, (err, result) => {
					if (err) {
						return res.status(401).json({
							error: { message: err.message },
						});
					}
					if (result) {
						const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET_KEY, {
							algorithm: 'HS256',
						});
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
			if (user.length === 0 && req.body.email && req.body.password && req.body.firstName) {
				if (!validator.isEmail(req.body.email)) {
					return res.status(422).json({
						error: { message: 'This is not a valid email' },
					});
				}
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
			} else {
				if (user.length === 1) {
					return res.status(409).json({
						error: { message: 'Existed' },
					});
				} else {
					return res.status(422).json({
						error: { message: 'Fields required' },
					});
				}
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
		.then((response) => {
			return res.status(200).json({
				data: { message: 'Delete successfully' },
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

exports.changeInfo = (req, res, next) => {
	const { id } = req.userData;
	const updateInfo = req.body;
	const phoneNumber = updateInfo.phone;
	if (phoneNumber && !validator.isMobilePhone(phoneNumber, ['vi-VN'])) {
		delete updateInfo.phone;
		console.log('wrong phone');
	}
	User.findOneAndUpdate({ _id: id }, updateInfo, {
		new: true,
	})
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
	const { id } = req.userData;
	User.find({ _id: id })
		.select('firstName lastName email img biography phone userName')
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
	const { id } = req.userData.id;
	User.deleteOne({ _id: id })
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
