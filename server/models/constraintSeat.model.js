const {Sequelize, sequelize} = require('../config/db');
const Plan = require('./plan.model')
const Constraint = require('./constraint.model')

const Model = Sequelize.Model;
class ConstraintSeat extends Model {}
ConstraintSeat.init({
    plan_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Plan,
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
    modelName: 'constraint_seat'
    // options
});

ConstraintSeat.belongsTo(Plan, {foreignKey: 'plan_id'});
Plan.hasMany(ConstraintSeat, {as: 'constraint_seats', foreignKey: 'plan_id'})

ConstraintSeat.belongsTo(Constraint, {foreignKey: 'constraint_id'});
Constraint.hasMany(ConstraintSeat, {as: 'constraint_seats', foreignKey: 'constraint_id'})

module.exports = ConstraintSeat