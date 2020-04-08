const {Sequelize, sequelize} = require('../config/db');
const Event = require('./event.model')
const Plan = require('./plan.model')
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
    color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#000000'
    },
    event_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Event,
            key: 'id',
        },
        allowNull: false,
    },
    plan_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Plan,
            key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
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
Event.hasMany(Group, {as: 'groups', foreignKey: 'event_id'});

Group.belongsTo(Plan, {foreignKey: 'plan_id'})
Plan.hasMany(Group, {as: 'groups', foreignKey: 'plan_id'})

Group.belongsTo(Constraint, {foreignKey: 'constraint_id'})
Constraint.hasMany(Group, {as: 'groups', foreignKey: 'constraint_id'})

Group.addScope('orderByCreation', {
    order: [['id', 'ASC']],
})
Group.addScope('orderByName', {
    order: [['name', 'ASC']],
})

module.exports = Group