const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '512mb' }));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000000,
    limit: '512mb',
    extended: true
}));

const user_route = require('./routes/users');


// custom route
app.use('/User', user_route);


module.exports = app;