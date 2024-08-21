const db = require('../../config/database');
const Sequelize = require('sequelize');
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const serviceResult = require('../../models/serviceResult');

const register = async (req,res) =>{
    
    try{
        const {username , email , password , role ,active} = req.body;
        const hashpassword = await bcrypt.hash(password,12);
        User.username = username;
        User.email = email;
        User.password = hashpassword;
        User.role = role;
        User.active = active;
        User.createAt = new Date();
        User.updateAt = new Date();

        const result = await User.create(User);
        
       
        serviceResult.status = "Success";
        serviceResult.message = "Register Successfuly!!"
        return res.status(200).json(serviceResult)

        
    } catch (error){
        console.log(error);
       
        serviceResult.status = "Error";
        serviceResult.message = error.errors.map(e => e.message)
        return res.status(500).json(serviceResult)
    }
}

module.exports = {
    register
}