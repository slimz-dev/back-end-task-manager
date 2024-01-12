const mongoose = require('mongoose');
const personalTaskSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	task: [
		{
			name: { type: String },
			state: { type: String },
			_id: { type: mongoose.Schema.Types.ObjectId },
			description: { type: String },
		},
	],
});

module.exports = mongoose.model('PersonalTask', personalTaskSchema);
