const Sequelize = require('sequelize');
const config = require('./index')

const sequelize = new Sequelize(config.dbConnection, {logging: false})
sequelize.authenticate()
  .then(() => {
    console.info('Connection has been established successfully!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {Sequelize, sequelize};