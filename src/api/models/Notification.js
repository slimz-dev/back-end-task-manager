const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
	receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
