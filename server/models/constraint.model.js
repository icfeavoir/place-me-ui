const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Constraint extends Model {}
Constraint.init({
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'constraint'
    // options
});

module.exports = Constraint