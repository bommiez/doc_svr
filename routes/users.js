const express = require('express');
const users_route = express.Router();
const authLogin = require('../middleware/user')

const loginController = require('../controller/users/login');
const registerController = require('../controller/users/register');
const getController = require('../controller/users/get');
const saveController = require('../controller/users/save');
const logoutController = require('../controller/users/logout');


const multer = require('multer');
const path = require('path');
const fs = require('fs');
// กำหนดตำแหน่งที่จัดเก็บไฟล์
const uploadPath = path.join(__dirname, '../public/images/users');

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
  
  // ตั้งค่า multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage });

users_route.post('/register',registerController.register);
users_route.post('/login',loginController.login);
users_route.post('/logout',logoutController.logout);


users_route.get('/getUserAll',authLogin.autUserLogin ,authLogin.authenLevelLogin ,getController.get );

users_route.get('/getuser/:id',authLogin.autUserLogin ,getController.getByUser );
users_route.put('/updateuser/:id',authLogin.autUserLogin ,saveController.updateUser );
users_route.delete('/deleteuser/:id',authLogin.autUserLogin ,authLogin.authenLevelLogin ,saveController.deleteUser );
users_route.get('/getUserRole',authLogin.autUserLogin  ,getController.getUserRole );

users_route.post('/uploadImgUser', upload.single('file') ,  authLogin.autUserLogin ,saveController.uploadImgUser);

users_route.put('/updatepassword/:id',authLogin.autUserLogin ,saveController.updatepassword );
module.exports = users_route