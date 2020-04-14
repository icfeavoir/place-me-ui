const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Constraint extends Model {}
Constraint.init({
    name: Sequelize.STRING,
}, {
    sequelize,
    modelName: 'constraint'
});

module.exports = Constraint