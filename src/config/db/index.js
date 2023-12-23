const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect('mongodb+srv://slimz:123@taskmanagement.2h8fmwv.mongodb.net/', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('success');
	} catch (error) {}
}

module.exports = { connect };
