const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	notification: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId },
			read: { type: Boolean },
			departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
			taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
		},
	],
});

module.exports = mongoose.model('Notification', notificationSchema);
