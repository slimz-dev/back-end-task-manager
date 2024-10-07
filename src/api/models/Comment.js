const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	content: { type: String },
	createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
