require('dotenv').config();
const Group = require('../models/Group');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//OK
exports.getTotalGroups = (req, res, next) => {
	Group.find({})
		.select()
		.exec()
		.then((groups) => {
			if (groups.length < 1) {
				return res.status(404).json({
					error: { message: 'No groups found' },
				});
			} else {
				return res.status(200).json({
					data: groups,
					meta: {
						numbers: groups.length,
					},
				});
			}
		})
		.catch();
};

//OK
exports.getGroup = (req, res, next) => {
	const { id } = req.params;

	Group.find({ _id: id })
		.then((group) => {
			return res.status(200).json({
				data: group,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};
exports.deleteTotal = (req, res, next) => {
	let { firstName, lastName, phone } = req.query;
	if (!lastName) {
		lastName = null;
	}
	User.find({ phone: phone })
		.or([{ firstName: new RegExp(firstName, 'i') }, { lastName: new RegExp(lastName, 'i') }])
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

exports.deleteGroup = (req, res, next) => {
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
exports.deleteMultipleGroup = (req, res, next) => {
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

exports.changeGroup = (req, res, next) => {
	const updateGroup = req.body;
	User.findOneAndUpdate({ name: 'Nhân viên' }, updateGroup, {
		new: true,
	})
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

//OK
exports.newGroup = (req, res, next) => {
	const {
		name,
		admin,
		localTaskManager,
		globalTaskManager,
		localMemberManager,
		globalMemberManager,
		invite,
		totalEmployees,
	} = req.body;
	const group = new Group({
		_id: new mongoose.Types.ObjectId(),
		name,
		admin,
		localTaskManager,
		globalTaskManager,
		localMemberManager,
		globalMemberManager,
		invite,
		totalEmployees,
	});
	group
		.save()
		.then((result) => {
			return res.status(201).json({ data: result });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};
