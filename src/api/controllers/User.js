const User = require('../models/User');
const Group = require('../models/Group');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const PersonalTask = require('../models/PersonalTask');
const Calendar = require('../models/Calendar');
const Task = require('../models/Task');

require('dotenv').config();

exports.getAllUser = (req, res, next) => {
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

exports.getMyDepartment = (req, res, next) => {
	const { id } = req.params;
	User.find({ department: id })
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

exports.getAnonymousUser = (req, res, next) => {
	User.find({ department: undefined })
		.select('_id firstName lastName img ')
		.exec()
		.then((users) => {
			if (users.length < 1) {
				return res.status(200).json({
					data: users,
					meta: {
						numbers: users.length,
					},
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
		.catch((err) => {
			return res.status(500).json({
				message: err.message,
			});
		});
};

exports.loginUser = (req, res, next) => {
	const { email, userName, password } = req.body;
	const account = email ? email : userName;
	const field = email === undefined ? 'userName' : 'email';
	User.find({ [field]: account })
		.then((user) => {
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
	const { email } = req.userData;
	//Check email valid
	if (email === req.body.email) {
		// Find exist Email
		User.find({ email: req.body.email })
			.then((user) => {
				if (
					user.length === 0 &&
					req.body.email &&
					req.body.password &&
					req.body.firstName
				) {
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
							Group.find({ name: process.env.DEFAULT_ROLE }).then((group) => {
								const users = new User({
									_id: new mongoose.Types.ObjectId().toString(),
									firstName: req.body.firstName,
									email: req.body.email,
									password: hash,
									role: group[0]._id,
								});
								users.save().then((result) => {
									const personalTask = new PersonalTask({
										_id: result._id,
										task: [],
									});
									personalTask.save().then((result) => {
										const myCalendar = new Calendar({
											_id: result._id,
											calendar: [],
										});
										myCalendar.save();
									});
									return res.status(201).json({ User: result });
								});
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
	} else {
		return res.status(403).json({
			error: {
				message: 'Unverified',
			},
		});
	}
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
exports.changeGroup = (req, res, next) => {
	const { id } = req.params;
	const updateInfo = req.body;
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
		.select('firstName lastName email img biography phone userName department role')
		.populate('role')
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

exports.changePassword = (req, res, next) => {
	const { id } = req.userData;
	const { password, newPassword } = req.body;
	User.find({ _id: id })
		.then((user) => {
			const passwordCompare = bcrypt.compare(password, user[0].password, (error, result) => {
				if (result) {
					bcrypt.hash(newPassword, 10, (err, hash) => {
						if (err) {
							return res.status(500).json({
								error: { message: err.message },
							});
						} else {
							const updateInfo = {
								password: hash,
							};
							User.findOneAndUpdate({ _id: id }, updateInfo, {
								new: true,
							})
								.then((user) => {
									return res.status(200).json({
										data: user,
									});
								})
								.catch((error) => {
									return res.status(500).json({
										error: {
											message: error.message,
										},
									});
								});
						}
					});
				} else {
					return res.status(401).json({
						error: { message: 'Wrong password' },
					});
				}
				if (error) {
					return res.status(422).json({
						error: { message: error.message },
					});
				}
			});
		})
		.catch((error) => {
			return res.status(500).json({
				error: { message: error.message },
			});
		});
};

exports.deleteDepartment = (req, res, next) => {
	const { id } = req.params;
	const { department } = req.body;
	User.findOne({ _id: id })
		.then((user) => {
			user.department = undefined;
			user.save().then();
			User.find({ department: department })
				.populate('role', 'name')
				.populate('department', 'name')
				.select('_id firstName lastName email img biography phone role department')
				.exec()
				.then((user) => {
					return res.status(200).json({
						data: user,
					});
				})
				.catch((err) => {
					return res.status(500).json({
						error: {
							message: err.message,
						},
					});
				})
				.catch((err) => {
					return res.status(500).json({
						error: {
							message: err.message,
						},
					});
				});
		})
		.catch((err) => {
			return res.status(500).json({
				error: {
					message: err.msg,
				},
			});
		});
};

exports.getMyTask = (req, res, next) => {
	const { id } = req.userData;
	Task.find({ assignee: id })
		.populate('assigner', 'firstName lastName')
		.then((task) => {
			return res.status(200).json({
				data: task,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				msg: err.message,
			});
		});
};
