const Event = require('../models/event.model')

module.exports = {
    getAll (req, res) {
        Event.findAll().then(event => {
            console.log(event)
            this._handleResponse(event, res)
        })
    },
    getById (req, res) {
        Event.findOne({where: {id: req.params.eventId}}).then(event => {
            console.log(event)
            this._handleResponse(event, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}