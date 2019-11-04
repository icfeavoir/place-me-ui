const {Sequelize, sequelize} = require('../config/db');
const Plan = require('./plan.model')

const Model = Sequelize.Model;
class ForbiddenSeat extends Model {}
ForbiddenSeat.init({
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
    modelName: 'forbidden_seat'
    // options
});

module.exports = ForbiddenSeat