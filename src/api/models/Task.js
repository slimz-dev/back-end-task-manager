const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String },
	department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
	assigner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	description: { type: String },
	smallJob: { type: Array },
	state: { type: Boolean, default: false },
	initDate: { type: Date, default: Date.now },
	expiredDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
