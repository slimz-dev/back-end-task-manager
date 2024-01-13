const mongoose = require('mongoose');
const calendarSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	calendar: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId },
			title: { type: String },
			start: { type: String },
			end: { type: String },
			date: { type: String },
		},
	],
});

module.exports = mongoose.model('Calendar', calendarSchema);
