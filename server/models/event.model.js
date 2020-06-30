const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Event extends Model {}
Event.init({
    name: Sequelize.STRING,
    date: Sequelize.DATE,
}, {
    sequelize,
    modelName: 'event'
});

module.exports = Event