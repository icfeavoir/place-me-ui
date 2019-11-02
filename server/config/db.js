const Sequelize = require('sequelize');
const config = require('./index')

const sequelize = new Sequelize(config.dbConnection)
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {Sequelize, sequelize};