const ForbiddenSeat = require('../models/forbiddenSeat.model')

module.exports = {
    getAll (req, res) {
        ForbiddenSeat.findAll().then(forbiddenSeats => {
            this._handleResponse(forbiddenSeats, res)
        })
    },
    getById (req, res) {
        ForbiddenSeat.findByPk(req.params.forbiddenSeatId).then(forbiddenSeat => {
            this._handleResponse(forbiddenSeat, res)
        })
    },
    getByPlanId (req, res) {
        ForbiddenSeat.findAll({where: {plan_id: req.params.planId}}).then(forbiddenSeats => {
            this._handleResponse(forbiddenSeats, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}