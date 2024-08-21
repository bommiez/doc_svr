const express = require('express');
const users_route = express.Router();
const authLogin = require('../middleware/user')

const loginController = require('../controller/users/login');
const registerController = require('../controller/users/register');
const getController = require('../controller/users/get');
const saveController = require('../controller/users/save');
const logoutController = require('../controller/users/logout');

users_route.post('/register',registerController.register);
users_route.post('/login',loginController.login);
users_route.post('/logout',logoutController.logout);


users_route.get('/getUserAll',authLogin.autUserLogin ,authLogin.authenLevelLogin ,getController.get );

users_route.get('/getuser/:id',authLogin.autUserLogin ,getController.getByUser );
users_route.put('/updateuser/:id',authLogin.autUserLogin ,saveController.updateUser );
users_route.delete('/deleteuser/:id',authLogin.autUserLogin ,saveController.deleteUser );

module.exports = users_route