const db = require('../../config/database');
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const serviceResult = require('../../models/serviceResult');
require('dotenv').config();

const login = async(req,res) =>{
    const {username,password} = req.body;
    try{
        let user = await User.findOne({ where: {username:username}});
        if(!user){
           
            serviceResult.status = "Error";
            serviceResult.message = "User not found!!";
            return res.status(404).json(serviceResult)
        }

        let match = await bcrypt.compare(password,user.password);
        if(!match){
           
            serviceResult.status = "Error";
            serviceResult.message = "Password not match";
            return res.status(404).json(serviceResult)
        }

        let tokenKey = process.env.SECRET_KEY;
        let token = jwt.sign({username},tokenKey,{expiresIn:'1m'})
        res.cookie('token',token,{
            maxAge:30000,
            secure: true,
            httpOnly:true,
            sameSite:"none",
        })
            
            serviceResult.status = "Success";
            serviceResult.value = {};
            serviceResult.message = "Login success!!";
            return res.status(200).json(serviceResult)
    }catch (error){
            console.log(error);
          
            serviceResult.status = "Error";
            serviceResult.message = error.errors.map(e => e.message)
            return res.status(500).json(serviceResult)
        
    }
}

module.exports = {login}