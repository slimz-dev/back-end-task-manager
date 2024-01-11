const User = require('./src/api/models/User');
const Group = require('./src/api/models/Group');
const Task = require('./src/api/models/Task');
const Department = require('./src/api/models/Department');
const { io } = require('./server');

let userState = [];
let userLoggedIn = {};
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

	socket.on('new_group', () => {
		Group.find({}).then((group) => {
			io.sockets.emit('new_group_update', { groups: group });
		});
	});
	socket.on('new_department', () => {
		Department.find({}).then((department) => {
			io.sockets.emit('new_department_update', { departments: department });
		});
	});
	socket.on('update_user_group', () => {
		User.find({})
			.populate('role', 'name')
			.populate('department', 'name')
			.then((user) => {
				io.sockets.emit('user_group_updated', { users: user });
			});
	});
	socket.on('update_job', (taskId, departmentId) => {
		Task.find({ _id: taskId })
			.populate('assigner', 'firstName lastName img')
			.populate('assignee', 'firstName lastName img')
			.populate({
				path: 'comment',
				populate: {
					path: 'createBy',
				},
			})
			.then((task) => {
				io.sockets.emit('updated_job', { tasks: task });
			})
			.catch();
	});

	socket.on('change_job', (departmentId) => {
		Task.find({ department: departmentId })
			.populate('assigner', 'firstName lastName img')
			.populate('assignee', 'firstName lastName img')
			.then((task) => {
				io.sockets.emit('changed_job', { tasks: task });
			})
			.catch();
	});
	socket.on('update_comment', (taskId) => {
		Task.find({ _id: taskId })
			.populate('assigner', 'firstName lastName img')
			.populate('assignee', 'firstName lastName img')
			.populate({
				path: 'comment',
				populate: {
					path: 'createBy',
				},
			})
			.then((task) => {
				io.sockets.emit('updated_comment', { tasks: task });
			}).catch;
	});
	socket.on('register', (data) => {
		userState.push({
			state: false,
			id: data.User._id.toString(),
		});
		io.sockets.emit('user-state', userState);
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
