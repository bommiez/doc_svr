const { Sequelize } = require('sequelize');

const db = new Sequelize('document','root','root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889, 
    logging: false,
});

db.authenticate()
  .then(() => {
    console.log('Connection database successfully.');
  })
  .catch(err => {
    console.error('Cannot to connect to the database:', err);
  });

module.exports = db;

