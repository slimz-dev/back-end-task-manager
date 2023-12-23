const User = require('./src/api/models/User');
const { io } = require('./server');

let userState = [];
let userLoggedIn = {};
User.find({})
	.then((userList) => {
		userList.map((user) => {
			return userState.push({
				state: false,
				id: user._id.toString(),
				tabsOpen: [],
			});
		});
	})
	.catch((error) => {
		console.log('error catching user');
	});

function handleCatchingState(id, state) {
	userState = userState.map((user) => {
		//find correct person to changing state
		if (user.id === id) {
			return {
				state,
				id,
			};
		}

		// not update
		return {
			state: user.state,
			id: user.id,
		};
	});
	return userState;
}

function isChangingState(tab) {
	const thisUser = userLoggedIn[tab];
	let countTabs = 0;
	for (const thisTab in userLoggedIn) {
		if (userLoggedIn[thisTab] === thisUser) {
			countTabs++;
			if (countTabs > 1) {
				console.log('more than 1 person using this account');
				return false;
			}
		}
	}
	return true;
}

const socketHandler = (socket) => {
	socket.on('connect_error', () => {
		console.log('error connecting to server');
	});
	socket.on('login', (id, login) => {
		//Login
		if (login) {
			userLoggedIn[socket.id] = id;
			io.sockets.emit('user-state', handleCatchingState(id, login));
		}
		//Logout
		else {
			//1 person - 1 tab => changing state
			if (isChangingState(socket.id)) {
				io.sockets.emit('user-state', handleCatchingState(id, login));
			}
			delete userLoggedIn[socket.id];
		}
	});

	socket.on('disconnect', () => {
		//changing state if only 1 tab
		if (isChangingState(socket.id)) {
			io.sockets.emit('user-state', handleCatchingState(userLoggedIn[socket.id], false));
		}

		delete userLoggedIn[socket.id];
	});
};

module.exports = socketHandler;
