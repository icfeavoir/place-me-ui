const Constraint = require('../models/constraint.model')
const ConstraintSeat = require('../models/constraintSeat.model')

module.exports = {
    getAll (req, res) {
        Constraint.findAll().then(constraints => {
            this._handleResponse(constraints, res)
        })
    },
    getById (req, res) {
        Constraint.findOne({where: {id: req.params.constraintId}}).then(constraint => {
            this._handleResponse(constraint, res)
        })
    },
    getByPlan (req, res) {
        ConstraintSeat.findAll({where: {plan_id: req.params.planId}}).then(constraintSeats => {
            this._handleResponse(constraintSeats, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}