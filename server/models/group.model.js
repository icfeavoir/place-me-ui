const {Sequelize, sequelize} = require('../config/db');
const EventPlan = require('./eventPlan.model')
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
    event_plan_id: {
        type: Sequelize.INTEGER,
        references: {
            model: EventPlan,
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

Group.belongsTo(EventPlan, {foreignKey: 'event_plan_id'});
EventPlan.hasMany(Group, {as: 'group', foreignKey: 'event_plan_id'})

Group.belongsTo(Constraint, {foreignKey: 'constraint_id'})
Constraint.hasMany(Group, {as: 'groups', foreignKey: 'constraint_id'})

Group.addScope('defaultScope', {
    include: [EventPlan, Constraint],
})
Group.addScope('eventPlanOnly', {
    include: [EventPlan],
})
Group.addScope('orderByCreation', {
    order: [['id', 'ASC']],
})
Group.addScope('orderByName', {
    order: [['name', 'ASC']],
})

module.exports = Group