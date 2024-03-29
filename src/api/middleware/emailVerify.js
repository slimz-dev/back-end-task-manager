const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
	try {
		const { token } = req.params;
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userData = decoded;
		next();
	} catch {
		(err) => {
			console.log('wrong');
			return res.status(401).json({
				error: {
					message: 'Authenticate failed',
				},
			});
		};
	}
};
