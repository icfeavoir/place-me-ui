const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Event extends Model {}
Event.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'event'
    // options
});

module.exports = Event