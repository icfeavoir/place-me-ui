const {Sequelize, sequelize} = require('../config/db');
const Plan = require('./plan.model')
const Constraint = require('./constraint.model')

const Model = Sequelize.Model;
class ConstraintSeat extends Model {}
ConstraintSeat.init({
    plan_id: Sequelize.INTEGER,
    constraint_id: Sequelize.INTEGER,
    line: Sequelize.INTEGER,
    cell: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'constraintSeat'
});

ConstraintSeat.belongsTo(Plan, {foreignKey: 'plan_id'});
Plan.hasMany(ConstraintSeat, {as: 'constraint_seats', foreignKey: 'plan_id'})

ConstraintSeat.belongsTo(Constraint, {foreignKey: 'constraint_id'});
Constraint.hasMany(ConstraintSeat, {as: 'constraint_seats', foreignKey: 'constraint_id'})

ConstraintSeat.addScope('defaultScope', {
    include: [Plan, Constraint],
})

module.exports = ConstraintSeat