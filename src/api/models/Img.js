const mongoose = require('mongoose');
const imgSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	img: { type: String },
});

module.exports = mongoose.model('Img', imgSchema);
