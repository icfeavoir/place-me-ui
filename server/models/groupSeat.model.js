const {Sequelize, sequelize} = require('../config/db');
const Group = require('./group.model')
const EventPlan = require('./eventPlan.model')

const Model = Sequelize.Model;
class GroupSeat extends Model {}
GroupSeat.init({
    group_id: Sequelize.INTEGER,
    event_plan_id: Sequelize.INTEGER,
    line: Sequelize.INTEGER,
    cell: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'groupSeat'
});

GroupSeat.belongsTo(Group, {foreignKey: 'group_id'});
Group.hasMany(GroupSeat, {as: 'group_seats', foreignKey: 'group_id'})

GroupSeat.belongsTo(EventPlan, {foreignKey: 'event_plan_id'});
EventPlan.hasMany(GroupSeat, {as: 'group_seats', foreignKey: 'event_plan_id'})

module.exports = GroupSeat