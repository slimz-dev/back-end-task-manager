const express = require('express');
const port = 3001;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoutes = require('./src/api/routes/User');
const mongoose = require('./src/config/db');
const User = require('./src/api/models/User');

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

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
	const error = new Error('Invalid');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

let userState = [];
User.find({})
	.then((userList) => {
		userList.map((user) => {
			return userState.push({
				state: false,
				id: user._id.toString(),
			});
		});
	})
	.catch((error) => {
		console.log('error catching user');
	});

function handleCatchingState(id, state) {
	userState = userState.map((user) => {
		if (user.id === id) {
			return {
				state,
				id,
			};
		} else {
			return {
				state: user.state,
				id: user.id,
			};
		}
	});
	return userState;
}
io.on('connection', (socket) => {
	socket.emit('online', userState);
	socket.on('connect', () => {
		console.log('connected');
	});
	socket.on('connect_error', () => {
		console.log('error connecting to server');
	});
	socket.on('login', (id) => {
		console.log(`user ${id} logged in`);
		socket.emit('online', handleCatchingState(id, true));
	});
	socket.on('disconnect', (id) => {
		console.log('disconnected');
		socket.emit('offline', handleCatchingState(id, false));
	});
	socket.on('logout', (id) => {
		console.log(`${id} logged out`);
		socket.emit('offline', handleCatchingState(id, false));
	});
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
