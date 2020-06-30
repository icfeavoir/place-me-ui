const {Sequelize, sequelize} = require('../config/db');

const Model = Sequelize.Model;
class Setting extends Model {}
Setting.init({
    name: Sequelize.STRING,
    value: Sequelize.STRING
}, {
    sequelize,
    modelName: 'setting'
});

module.exports = Setting