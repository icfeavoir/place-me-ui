const {Sequelize, sequelize} = require('../config/db');

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
        defaultValue: null
    },
    plan_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Constraint,
            key: 'id',
        },
        allowNull: false,
        defaultValue: null
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

module.exports = GroupSeat