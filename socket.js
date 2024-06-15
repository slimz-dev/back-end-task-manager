const User = require('./src/api/models/User');
const Group = require('./src/api/models/Group');
const Task = require('./src/api/models/Task');
const Department = require('./src/api/models/Department');
const Notification = require('./src/api/models/Notification');
const mongoose = require('mongoose');
const { io } = require('./server');

let userState = [];
let userLoggedIn = {};
console.log('connecting to socket file');
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
	//Check new user registered
	const userExisted = userState.find((user) => user.id === id);
	if (userExisted === undefined) {
		userState.push({
			state: state,
			id: id,
		});
	}

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

function updateNotifacation(userId, departmentId, taskId) {
	const currentDate = new Date();
	Notification.findOne({ _id: userId })
		.select()
		.exec()
		.then((notification) => {
			//NOT EXISTED
			if (notification === null) {
				const notification = new Notification({
					_id: userId,
					notification: [
						{
							_id: new mongoose.Types.ObjectId().toString(),
							read: false,
							departmentId: departmentId,
							taskId: taskId,
							createdAt: currentDate,
						},
					],
				});
				notification.save().then((notification) => {
					let broadcastSocketIds = [];
					//get all the current socketid opened by the remain ids
					for (let socketId in userLoggedIn) {
						if (userId === userLoggedIn[socketId]) {
							broadcastSocketIds.push(socketId);
						}
					}
					//broadcast notification
					broadcastSocketIds.forEach((socketId) => {
						io.to(socketId).emit('notification');
					});
				});
			} else {
				Notification.findOneAndUpdate(
					{ _id: userId },
					{
						$push: {
							notification: {
								_id: new mongoose.Types.ObjectId().toString(),
								read: false,
								departmentId: departmentId,
								taskId: taskId,
								createdAt: currentDate,
							},
						},
					},
					{ new: true }
				).then((notification) => {
					let broadcastSocketIds = [];
					//get all the current socketid opened by the remain ids
					for (let socketId in userLoggedIn) {
						if (userId === userLoggedIn[socketId]) {
							broadcastSocketIds.push(socketId);
						}
					}
					//broadcast notification
					broadcastSocketIds.forEach((socketId) => {
						io.to(socketId).emit('notification');
					});
				});
			}
		});
}

const socketHandler = (socket) => {
	console.log('connected');
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

	socket.on('update_my_department', (departmentId) => {
		User.find({ department: departmentId })
			.populate('role', 'name')
			.populate('department', 'name')
			.then((user) => {
				io.sockets.emit('my_department_updated', { users: user });
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
	socket.on('update_comment', (taskId, userId, departmentId) => {
		Task.find({ _id: taskId })
			.populate('assigner', 'firstName lastName img')
			.populate('assignee', 'firstName lastName img')
			.populate({
				path: 'comment',
				populate: {
					path: 'createBy',
				},
			})
			.then(async (task) => {
				task[0].comment.sort((a, b) => {
					return b.createAt - a.createAt;
				});
				//update comment
				io.sockets.emit('updated_comment', { tasks: task });
				// send notification

				//get all id from task
				const assignerId = task[0].assigner._id.toString();
				const assigneeIds = task[0].assignee.map((user) => user._id.toString());
				const commentIds = task[0].comment.map((user) => user.createBy._id.toString());
				const arrayOfIds = [assignerId, ...assigneeIds, ...commentIds];
				const removeDuplicates = arrayOfIds.filter(
					(id, index) => arrayOfIds.indexOf(id) === index
				);
				//get all id except the id make comment
				let broadcastIds = removeDuplicates;
				const indexFound = removeDuplicates.indexOf(userId);
				if (indexFound !== -1) {
					broadcastIds.splice(indexFound, 1);
				}

				//Update notification
				for await (const id of broadcastIds) {
					const update = () => {
						updateNotifacation(id, departmentId, taskId);
					};
					update();
				}
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
