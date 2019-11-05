const Constraint = require('../models/constraint.model')

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
    _handleResponse (data, res) {
        res.send(data)
    }
}