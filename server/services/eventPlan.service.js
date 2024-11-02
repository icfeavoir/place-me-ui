const EventPlan = require('../models/eventPlan.model');

module.exports = {
  getAll(req, res) {
    EventPlan.findAll().then((eventPlans) => {
      this._handleResponse(eventPlans, res);
    });
  },
  getEventPlan(id) {
    return EventPlan.findByPk(id);
  },
  getById(req, res) {
    this.getEventPlan(req.params.id).then((eventPlan) => {
      this._handleResponse(eventPlan, res);
    });
  },
  getByEventId(req, res) {
    EventPlan.findAll({ where: { event_id: req.params.eventId } }).then(
      (eventPlans) => {
        this._handleResponse(eventPlans, res);
      }
    );
  },
  getByEventIdPlanId(req, res) {
    EventPlan.findOne({
      where: { event_id: req.params.eventId, plan_id: req.params.planId },
    }).then((eventPlan) => {
      this._handleResponse(eventPlan, res);
    });
  },
  _handleResponse(data, res) {
    res.send(data);
  },
};
