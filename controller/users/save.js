const User = require('../../models/users');
const serviceResult = require('../../models/serviceResult');
const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const host = process.env.HOST;
const port = process.env.PORT;
const updateUser = async (req,res) =>{
    const id = req.params.id;
    const data = req.body;
    const userLogin = req.user;
    try{
        let checkUser = await User.findOne({ where: {username:userLogin.username,active:'Y'}});
            if(!checkUser){
                serviceResult.status = "Error";
                serviceResult.value = {};
                serviceResult.message = "User not found!!";
                return res.status(404).json(serviceResult)
            }
            let users = await User.findByPk(id);
            if(userLogin.username != users.dataValues.username && checkUser.dataValues.role  != 'admin'){
                serviceResult.status = "Error";
                serviceResult.value = {};
                serviceResult.message = "Unable to search for other users."
                return res.status(404).json(serviceResult)
            }else if (userLogin.username != users.dataValues.username && checkUser.dataValues.role  == 'admin'){
                let result = await User.update({
                    firstname:data.firstname,
                    lastname:data.lastname,
                    nickname:data.nickname,
                    fullname:data.fullname,
                    sex:data.sex,
                    email:data.email
                    },
                    {where:{id:users.id,active:'Y'}});
                let resultUpdate = await User.findByPk(id);
                serviceResult.status = "Success";
                serviceResult.value = resultUpdate;
                serviceResult.message = "Update user succesfuly by Admin"
                return res.status(200).json(serviceResult)
            }else if(userLogin.username == users.dataValues.username && (checkUser.dataValues.role  == 'member' || checkUser.dataValues.role  == 'admin')){
                let result =  await User.update({
                    firstname:data.firstname,
                    lastname:data.lastname,
                    nickname:data.nickname,
                    fullname:data.fullname,
                    sex:data.sex,
                    email:data.email
                    },
                    {where:{id:users.id,active:'Y'}});
                let resultUpdate = await User.findByPk(id);
                serviceResult.status = "Success";
                serviceResult.value = resultUpdate;
                serviceResult.message = "Update user succesfuly by owner"
                return res.status(200).json(serviceResult)
            }
       
    }catch (error){
        console.log(error);
        serviceResult.status = "Error";
        serviceResult.value = {};
        serviceResult.message = error.errors.map(e => e.message)
        return res.status(500).json(serviceResult)
    }
}


const deleteUser = async (req,res) =>{
    const id = req.params.id;
    const userLogin = req.user;
    try{
        let checkUser = await User.findOne({ where: {username:userLogin.username,active:'Y'}});
            if(!checkUser){
                serviceResult.status = "Error";
                serviceResult.value = {};
                serviceResult.message = "User not found!!";
                return res.status(404).json(serviceResult)
            }
            let users = await User.findByPk(id);
            if(checkUser.dataValues.role  != 'admin'){
                serviceResult.status = "Error";
                serviceResult.value = {};
                serviceResult.message = "Unable to search for other users."
                return res.status(404).json(serviceResult)
            }else{
                let result = await User.update({active:'N'},{where:{id:users.id}});
                let resultUpdate = await User.findByPk(id);
                serviceResult.status = "Success";
                serviceResult.value = resultUpdate;
                serviceResult.message = "Soft Deleted succesfuly"
                return res.status(200).json(serviceResult)
            }
       
    }catch (error){
        console.log(error);
        serviceResult.status = "Error";
        serviceResult.value = {};
        serviceResult.message = error.errors.map(e => e.message)
        return res.status(500).json(serviceResult)
    }
}
const uploadImgUser = async (req,res) =>{
    const id = req.body.id;
    const file = req.file;
    try {
        if (file) {
            const fileName = file.filename;
            const fileUrl = `${host}:${port}/public/images/users/${fileName}`;
            let user = await User.findByPk(id);
           
            if(user.image != null){
                const fileName = path.join(__dirname, '../../', 'public', 'images', 'users', user.image);
                console.log('File name:', fileName);
                if (fs.existsSync(fileName)) {
                  fs.unlinkSync(fileName);
                } else {
                  console.error('File does not exist:', fileName);
                }
            }
            let result = await User.update({image:fileName,pathimage:fileUrl},{ where: {id:id,active:'Y'}});
            serviceResult.status = "Success";
            serviceResult.value = {};
            serviceResult.message = "Upload Success";
            return res.status(200).json(serviceResult)
        } else {
            serviceResult.status = "Error";
            serviceResult.value = {};
            serviceResult.message = "No file uploaded";
            return res.status(400).json(serviceResult)
        }
      } catch (error) {
        console.error('Error:', error);
        serviceResult.status = "Error";
        serviceResult.value = {};
        serviceResult.message = "Internal Server Error";
        return res.status(500).json(serviceResult)
      }
}

const updatepassword = async (req,res) =>{
   const id = req.body.id;
   const oldpass = req.body.oldpass;
   const newpass = req.body.newpass;
   const confirmpass = req.body.confirmpass;
   try{
        if(newpass != confirmpass){
            serviceResult.status = "Error";
            serviceResult.message = "Password and Confirmpassword not match";
            return res.status(404).json(serviceResult)
        }
        let user = await User.findByPk(id);
        if(!user){
            serviceResult.status = "Error";
            serviceResult.message = "User not found!!";
            return res.status(404).json(serviceResult)
        }
        let match = await bcrypt.compare(oldpass,user.password);
        if(!match){
            serviceResult.status = "Error";
            serviceResult.message = "Password not match";
            return res.status(404).json(serviceResult)
        }
        const hashnewpassword = await bcrypt.hash(newpass,12);
        let result = await User.update({password:hashnewpassword},{ where: {id:id,active:'Y'}});
        serviceResult.status = "Success";
        serviceResult.value = {};
        serviceResult.message = "Update password Success";
        return res.status(200).json(serviceResult)

   }catch (error) {
        console.error('Error:', error);
        serviceResult.status = "Error";
        serviceResult.value = {};
        serviceResult.message = "Internal Server Error";
        return res.status(500).json(serviceResult)
      }
}

module.exports ={
    updateUser,
    deleteUser,
    uploadImgUser,
    updatepassword
}