const {Sequelize, sequelize} = require('../config/db');
const Event = require('./event.model')
const Plan = require('./plan.model')

const Model = Sequelize.Model;
class EventPlan extends Model {}
EventPlan.init({
    event_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Event,
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
    }
}, {
    sequelize,
    modelName: 'event_plan'
});

EventPlan.belongsTo(Event, {foreignKey: 'event_id'})
EventPlan.belongsTo(Plan, {foreignKey: 'plan_id'})

module.exports = EventPlan