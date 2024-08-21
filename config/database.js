const { Sequelize } = require('sequelize');

const db = new Sequelize('document','document_v9uw_user','yKa6fnwUSSYcil6cIJbeROO0FHI6zF9d', {
    host: '192.168.1.1',
    dialect: 'postgres',
    port: 5432, 
});

db.authenticate()
  .then(() => {
    console.log('Connection database successfully.');
  })
  .catch(err => {
    console.error('Cannot to connect to the database:', err);
  });

module.exports = db;

