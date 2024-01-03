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

//OK
exports.deleteGroup = (req, res, next) => {
	const { id } = req.params;
	Group.findOneAndDelete({ _id: id })
		.then((response) => {
			return res.status(200).json({
				data: response,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

//OK
exports.deleteMultipleGroup = (req, res, next) => {
	const groupsDeleted = req.body;
	groupsDeleted.forEach((group) => {
		console.log('hi');
		Group.findOneAndDelete({ _id: group }).then((response) => {
			console.log(response);
		});
	});
	return res.status(200).json({
		data: 'Delete successfully !',
	});
};

//OK
exports.changeGroup = (req, res, next) => {
	const updateGroup = req.body;
	const { id } = req.params;
	Group.findOneAndUpdate({ _id: id }, updateGroup, {
		new: true,
	})
		.then((response) => {
			return res.status(200).json({
				data: response,
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
