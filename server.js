require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
// const server = https.createServer(app);
const { Server } = require('socket.io');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoutes = require('./src/api/routes/User');
const groupRoutes = require('./src/api/routes/Group');
const departmentRoutes = require('./src/api/routes/Department');
const personaltaskRoutes = require('./src/api/routes/PersonalTask');
const taskRoutes = require('./src/api/routes/Task');
const commentRoutes = require('./src/api/routes/Comment');
const calendarRoutes = require('./src/api/routes/Calendar');
const emailRoutes = require('./src/api/routes/Email');
const notificationRoutes = require('./src/api/routes/Notification');
const mongoose = require('./src/config/db');
const io = new Server(server, {
	cors: {
		origin: process.env.FE_URL,
		credentials: true,
	},
});

exports.io = io;
const socketHandler = require('./socket');
//connect db
mongoose.connect();

//HTTP request
// app.use(morgan('combined'));

//Parser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.get('/', (req, res, next) => {
	res.status(200);
	res.json({
		message: 'Back-end server connected successfully !!',
	});
	next();
});
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/personaltask', personaltaskRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/notification', notificationRoutes);

// app.use((req, res, next) => {
// 	const error = new Error('Invalid');
// 	error.status = 404;
// 	next(error);
// });

// app.use((error, req, res, next) => {
// 	if (res.headersSent) {
// 		return next(error);
// 	}
// 	res.status(error.status || 500);
// 	res.json({
// 		error: {
// 			message: error.message,
// 		},
// 	});
// });

io.on('connection', socketHandler);
server.listen(process.env.PORT || 3001, () => {
	console.log(`Example app listening on port ${process.env.PORT || 3001}`);
});

module.exports = app;
