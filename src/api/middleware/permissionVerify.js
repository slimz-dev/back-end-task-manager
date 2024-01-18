const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = (permissionName, arrayOfPermissions) => {
	let permissionsPass = [];
	return (req, res, next) => {
		try {
			const { id } = req.userData;
			User.findOne({ _id: id })
				.populate('role')
				.then((user) => {
					arrayOfPermissions.forEach((permission) => {
						if (user.role[permissionName][permission] === true) {
							permissionsPass.push(true);
						}
					});
					if (permissionsPass.includes(true)) {
						next();
					} else {
						return res.status(403).json({
							err: {
								message: 'Permission denied',
							},
						});
					}
				});
		} catch {
			(err) => {
				console.log('wrong');
				return res.status(403).json({
					error: {
						message: 'Permission denied',
					},
				});
			};
		}
	};
};
