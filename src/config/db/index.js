const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect('mongodb://localhost:27017/task_management_dev', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('success');
	} catch (error) {}
}

module.exports = { connect };
