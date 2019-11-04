const {Sequelize, sequelize} = require('../config/db');
const Event = require('./event.model')
const Constraint = require('./constraint.model')

const Model = Sequelize.Model;
class Group extends Model {}
Group.init({
    // attributes
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    event_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Event,
            key: 'id',
        },
        allowNull: false,
    },
    constraint_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Constraint,
            key: 'id',
        },
        allowNull: true,
        defaultValue: null,
    },
    constraint_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'group'
    // options
});

Group.belongsTo(Event, {foreignKey: 'event_id'})
Group.belongsTo(Constraint, {foreignKey: 'constraint_id'})

module.exports = Group