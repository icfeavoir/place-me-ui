const Event = require('../models/event.model')

const gaService = require('./ga.service')

module.exports = {
    getAll (req, res) {
        Event.findAll().then(event => {
            this._handleResponse(event, res)
        })
    },
    getById (req, res) {
        this.getEvent(req.params.eventId)
            .then(event => {
                this._handleResponse(event, res)
            })
    },

    getEvent (id) {
        return Event.findByPk(id)
    },
    generate (req, res) {
        var eventId = req.body.eventId
        var planId = req.body.planId || null
        gaService.generate(eventId, planId).then(data => {
            this._handleResponse(data, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}