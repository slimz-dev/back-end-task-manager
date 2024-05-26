const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//OK
exports.newEmail = (req, res, next) => {
	const { email } = req.body;
	if (email) {
		const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
			algorithm: 'HS256',
		});
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smpt.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_ACCOUNT,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		async function main() {
			// send mail with defined transport object
			const info = await transporter.sendMail({
				from: `"noreply" <hungdeptrai1312313@gmail.com>`, // sender address
				to: email, // list of receivers
				subject: 'Registration verify from task manager', // Subject line
				text: 'Hello world?', // plain text body
				html: `<div>Click <a href=${process.env.FE_URL}/register/${token}>this</a> link to register !</div>`, // html body
			});

			console.log('Message sent: %s', info.messageId);
		}

		main()
			.then((result) => {
				return res.status(200).json({
					data: 'OK',
				});
			})
			.catch((err) => {
				return res.status(500).json({
					msg: err.message,
				});
			});
	}
};
