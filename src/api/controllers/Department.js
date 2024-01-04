require('dotenv').config();
const Department = require('../models/Department');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//OK
exports.getTotalDepartments = (req, res, next) => {
	Department.find({})
		.select()
		.exec()
		.then((department) => {
			if (department.length < 1) {
				return res.status(404).json({
					error: { message: 'No department found' },
				});
			} else {
				return res.status(200).json({
					data: department,
					meta: {
						numbers: department.length,
					},
				});
			}
		})
		.catch();
};

//OK
exports.getDepartment = (req, res, next) => {
	const { id } = req.params;

	Department.find({ _id: id })
		.then((department) => {
			return res.status(200).json({
				data: department,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				error: { message: err.message },
			});
		});
};

//OK
exports.deleteDepartment = (req, res, next) => {
	const { id } = req.params;
	Department.findOneAndDelete({ _id: id })
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
exports.changeDepartment = (req, res, next) => {
	const updateDepartment = req.body;
	const { id } = req.params;
	Department.findOneAndUpdate({ _id: id }, updateDepartment, {
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
exports.newDepartment = (req, res, next) => {
	const { name } = req.body;
	const department = new Department({
		_id: new mongoose.Types.ObjectId(),
		name,
	});
	department
		.save()
		.then((result) => {
			return res.status(201).json({ data: result });
		})
		.catch((err) => {
			return res.status(500).json({ error: err.message });
		});
};
