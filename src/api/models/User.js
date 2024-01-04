const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
	},
	department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
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
