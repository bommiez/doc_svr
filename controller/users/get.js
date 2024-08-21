const User = require('../../models/users');
const serviceResult = require('../../models/serviceResult');
const get = async (req,res) =>{
    try{
        let users = await User.findAll({where:{active:'Y'}});
       
        serviceResult.status = "Success";
        serviceResult.value = users;
        serviceResult.message = "Get user succesfuly!"
        return res.status(200).json(serviceResult)
    }catch (error){
        console.log(error);
        serviceResult.status = "Error";
        serviceResult.value = {};
        serviceResult.message = error.errors.map(e => e.message)
        return res.status(500).json(serviceResult)
    }
}

const getByUser = async (req,res) =>{
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
                
                if(userLogin.username != users.dataValues.username && checkUser.dataValues.role  != 'admin'){
                    serviceResult.status = "Error";
                    serviceResult.value = {};
                    serviceResult.message = "Unable to search for other users."
                    return res.status(404).json(serviceResult)
                }else if (userLogin.username != users.dataValues.username && checkUser.dataValues.role  == 'admin'){
                    serviceResult.status = "Success";
                    serviceResult.value = users;
                    serviceResult.message = "Get user succesfuly by Admin"
                    return res.status(200).json(serviceResult)
                }else if(userLogin.username == users.dataValues.username && (checkUser.dataValues.role  == 'member' || checkUser.dataValues.role  == 'admin')){
                    serviceResult.status = "Success";
                    serviceResult.value = users;
                    serviceResult.message = "Get user succesfuly by member"
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
module.exports = {
    get,
    getByUser
}