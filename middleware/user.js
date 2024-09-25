const jwt = require('jsonwebtoken');
const User = require('../models/users');
const serviceResult = require('../models/serviceResult');
require('dotenv').config();


const autUserLogin = async (req,res,next) =>{
   const token = req.cookies.token;
   try{
        if(!token){
            serviceResult.status = "Error";
            serviceResult.message = "token not found!";
            return res.status(401).json(serviceResult)
        }
        let tokenKey = process.env.SECRET_KEY;
        jwt.verify(token, tokenKey, async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    serviceResult.status = "Error";
                    serviceResult.message = "Token has expired";
                    return res.status(403).json(serviceResult)
                } else {
                    serviceResult.status = "Error";
                    serviceResult.message = "User not using";
                    return res.status(403).json(serviceResult)
                }

            }
            let checkUser = await User.findOne({ where: {username:user.username,active:'Y'}});
            if(!checkUser){
                serviceResult.status = "Error";
                serviceResult.message = "User not found!!";
                return res.status(404).json(serviceResult)
            }
            req.user = user;
            next();
        });

    }catch (error){
        console.log(error);
        serviceResult.status = "Error";
        serviceResult.message = error.errors.map(e => e.message);
        return res.status(500).json(serviceResult)
    }
}


const authenLevelLogin = async (req,res,next) =>{
    const token = req.cookies.token;
    try{
         if(!token){
            serviceResult.status = "Error";
            serviceResult.message = "token not found!";
            return res.status(401).json(serviceResult)
         }else{
            
         }
         let tokenKey = process.env.SECRET_KEY;
         jwt.verify(token, tokenKey, async (err, user) => {
             if (err) {
                 if (err.name === 'TokenExpiredError') {
                    serviceResult.status = "Error";
                    serviceResult.message = "Token has expired";
                    return res.status(403).json(serviceResult)
                 } else {
                    serviceResult.status = "Error";
                    serviceResult.message = "User not using";
                    return res.status(403).json(serviceResult)
                 }
 
             }
             let checkUser = await User.findOne({ where: {username:user.username}});
             if(!checkUser){
                serviceResult.status = "Error";
                serviceResult.message = "User not found!!";
                return res.status(404).json(serviceResult)
             }
             if(checkUser.dataValues.role != 'admin'){
                serviceResult.status = "Error";
                serviceResult.message = "User not using";
                return res.status(403).json(serviceResult)
                
             }
             req.user = user;
             next();
         });
 
     }catch (error){
                console.log(error);
                serviceResult.status = "Error";
                serviceResult.message = error.errors.map(e => e.message);
                return res.status(500).json(serviceResult)
     }
}
module.exports = {
    autUserLogin,
    authenLevelLogin
}
