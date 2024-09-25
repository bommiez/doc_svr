const db = require('../../config/database');
const Sequelize = require('sequelize');
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const serviceResult = require('../../models/serviceResult');

const register = async (req,res) =>{
    
    try{
        const {username , email , password , confirmpassword ,firstname ,lastname ,sex ,fullname , nickname} = req.body;
        if(password != confirmpassword){
            serviceResult.status = "Error";
            serviceResult.message = "Password not match"
            return res.status(404).json(serviceResult)
        }


        const hashpassword = await bcrypt.hash(password,12);
        User.username = username;
        User.email = email;
        User.firstname =firstname;
        User.lastname = lastname;
        User.nickname = nickname;
        User.sex = sex;
        User.fullname = fullname
        User.password = hashpassword;
        User.role = 'member';
        User.active = 'Y';
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