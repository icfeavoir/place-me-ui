const EventPlan = require('../models/EventPlan.model')

module.exports = {
    getAll (req, res) {
        EventPlan.findAll().then(eventPlans => {
            this._handleResponse(eventPlans, res)
        })
    },
    getEventPlan (id) {
        return EventPlan.findByPk(id)
    },
    getById (req, res) {
        this.getEventPlan(req.params.id)
            .then(eventPlan => {
                this._handleResponse(eventPlan, res)
            })
    },
    getByEventId (req, res) {
        console.log('several')
        EventPlan.findAll({where: {event_id: req.params.eventId}}).then(eventPlans => {
            this._handleResponse(eventPlans, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}