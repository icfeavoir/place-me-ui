const Sequelize = require('sequelize');

let connection = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
const sequelize = new Sequelize(connection, {logging: false})
sequelize.authenticate()
  .then(() => {
    console.info('Connection has been established successfully!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {Sequelize, sequelize};