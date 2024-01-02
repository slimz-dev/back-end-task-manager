const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
	},
	department: { type: String, default: 'xxx' },
	userName: { type: String },
	firstName: { type: String },
	lastName: { type: String },
	biography: { type: String },
	phone: { type: String },
	address: { type: String },
	email: {
		type: String,
		unique: true,
	},
	secondEmail: {
		type: String,
	},
	img: { type: String },
	password: { type: String },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
