const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userName: { type: String },
	firstName: { type: String },
	lastName: { type: String },
	biography: { type: String },
	phone: { type: String },
	address: { type: String },
	img: { type: String },
	email: {
		type: String,
		unique: true,
	},
	secondEmail: {
		type: String,
	},
	password: { type: String },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
