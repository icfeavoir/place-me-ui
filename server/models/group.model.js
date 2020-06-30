const {Sequelize, sequelize} = require('../config/db');
const EventPlan = require('./eventPlan.model')
const Constraint = require('./constraint.model')

const Model = Sequelize.Model;
class Group extends Model {}
Group.init({
    // attributes
    name: Sequelize.STRING,
    number: Sequelize.INTEGER,
    color: Sequelize.STRING,
    event_plan_id: Sequelize.INTEGER,
    constraint_id: Sequelize.INTEGER,
    constraint_number: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'group'
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
Group.addScope('orderByNumber', {
    order: [['number', 'DESC']],
})

module.exports = Group