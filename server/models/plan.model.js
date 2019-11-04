const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Plan extends Model {}
Plan.init({
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    width: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
}, {
    sequelize,
    modelName: 'plan'
    // options
});

module.exports = Plan