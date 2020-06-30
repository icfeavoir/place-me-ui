const {Sequelize, sequelize} = require('../config/db');
const Plan = require('./plan.model')

const Model = Sequelize.Model;
class ForbiddenSeat extends Model {}
ForbiddenSeat.init({
    plan_id: Sequelize.INTEGER,
    line: Sequelize.INTEGER,
    cell: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'forbiddenSeat'
});

ForbiddenSeat.belongsTo(Plan, {foreignKey: 'plan_id'})
Plan.hasMany(ForbiddenSeat, {as: 'forbidden_seats', foreignKey: 'plan_id'})

module.exports = ForbiddenSeat