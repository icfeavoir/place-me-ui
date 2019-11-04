const GroupSeat = require('../models/groupSeat.model')

module.exports = {
    getAll (req, res) {
        GroupSeat.findAll().then(groupSeat => {
            this._handleResponse(groupSeat, res)
        })
    },
    getById (req, res) {
        GroupSeat.findOne({where: {id: req.params.groupSeatId}}).then(groupSeat => {
            this._handleResponse(groupSeat, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}