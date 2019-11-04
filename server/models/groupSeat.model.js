const {Sequelize, sequelize} = require('../config/db');
const Group = require('./group.model')
const Plan = require('./plan.model')

const Model = Sequelize.Model;
class GroupSeat extends Model {}
GroupSeat.init({
    group_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Group,
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
    // options
});

GroupSeat.belongsTo(Group, {foreignKey: 'group_id'});
GroupSeat.belongsTo(Plan, {foreignKey: 'plan_id'});

module.exports = GroupSeat