const { DataTypes} = require('sequelize');
const sequelize = require('../config/database.js')

const User = sequelize.define('User', {
    username: {type: DataTypes.STRING,allowNull: false,unique:true},
    email: {type: DataTypes.STRING,allowNull: false,unique:true},
    password: {type: DataTypes.STRING,allowNull: false },
    firstname: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    lastname: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    fullname: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    nickname: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    image: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    pathimage: {type: DataTypes.STRING,allowNull: true ,defaultValue:null},
    sex: {type: DataTypes.STRING,allowNull: true},
    role: {type: DataTypes.STRING,allowNull: false},
    active: {type: DataTypes.STRING,allowNull: false},
  });
  
  module.exports = User;