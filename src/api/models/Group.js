const mongoose = require('mongoose');
require('dotenv').config();

const groupSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, default: process.env.DEFAULT_ROLE },
	admin: {
		create: { type: Boolean, default: false },
		read: { type: Boolean, default: false },
		update: { type: Boolean, default: false },
		delete: { type: Boolean, default: false },
	},
	localTaskManager: {
		create: { type: Boolean, default: false },
		read: { type: Boolean, default: true },
		delete: { type: Boolean, default: false },
		update: { type: Boolean, default: false },
	},
	globalTaskManager: {
		create: { type: Boolean, default: false },
	},
	localMemberManager: {
		create: { type: Boolean, default: false },
		read: { type: Boolean, default: true },
		delete: { type: Boolean, default: false },
	},
	globalMemberManager: {
		create: { type: Boolean, default: false },
	},
	invite: {
		create: { type: Boolean, default: false },
	},
	totalEmployees: {
		read: { type: Boolean, default: false },
	},
});

module.exports = mongoose.model('Group', groupSchema);
