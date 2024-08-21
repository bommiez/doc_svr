const User = require('../../models/users');
const serviceResult = require('../../models/serviceResult');

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
                let result = await User.update({username:data.username,email:data.email},{where:{id:users.id,active:'Y'}});
                let resultUpdate = await User.findByPk(id);
                serviceResult.status = "Success";
                serviceResult.value = resultUpdate;
                serviceResult.message = "Update user succesfuly by Admin"
                return res.status(200).json(serviceResult)
            }else if(userLogin.username == users.dataValues.username && (checkUser.dataValues.role  == 'member' || checkUser.dataValues.role  == 'admin')){
                let result =  await User.update({username:data.username,email:data.email},{where:{id:users.id,active:'Y'}});
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
module.exports ={
    updateUser,
    deleteUser
}