const {Sequelize, sequelize} = require('../config/db');
const Group = require('./group.model')
const EventPlan = require('./eventPlan.model')

const Model = Sequelize.Model;
class GroupSeat extends Model {}
GroupSeat.init({
    group_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
    },
    event_plan_id: {
        type: Sequelize.INTEGER,
        references: {
            model: EventPlan,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    line: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cell: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'group_seat'
});

GroupSeat.belongsTo(Group, {foreignKey: 'group_id'});
Group.hasMany(GroupSeat, {as: 'group_seats', foreignKey: 'group_id'})

GroupSeat.belongsTo(EventPlan, {foreignKey: 'event_plan_id'});
EventPlan.hasMany(GroupSeat, {as: 'group_seats', foreignKey: 'event_plan_id'})

module.exports = GroupSeat