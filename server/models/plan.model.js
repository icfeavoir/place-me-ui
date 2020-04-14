const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Plan extends Model {}
Plan.init({
    // attributes
    name: Sequelize.STRING,
    width: Sequelize.INTEGER,
    height: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'plan'
});

module.exports = Plan