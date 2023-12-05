const express = require('express');
const port = 3001;
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./src/api/routes/User');
const mongoose = require('./src/config/db');

//connect db
mongoose.connect();

//HTTP request
app.use(morgan('combined'));

//Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
