const {Sequelize, sequelize} = require('../config/db');
const Event = require('./event.model')
const Plan = require('./plan.model')

const Model = Sequelize.Model;
class EventPlan extends Model {}
EventPlan.init({
    event_id: Sequelize.INTEGER,
    plan_id: Sequelize.INTEGER,
}, {
    sequelize,
    modelName: 'eventPlan'
});

EventPlan.belongsTo(Event, {foreignKey: 'event_id'})
EventPlan.belongsTo(Plan, {foreignKey: 'plan_id'})

EventPlan.addScope('defaultScope', {
    include: [Event, Plan]
})

module.exports = EventPlan