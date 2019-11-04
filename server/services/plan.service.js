const Plan = require('../models/plan.model')

module.exports = {
    getAll (req, res) {
        Plan.findAll().then(plans => {
            console.log(plans)
            this._handleResponse(plans, res)
        })
    },
    getById (req, res) {
        Plan.findOne({where: {id: req.params.planId}}).then(plan => {
            this._handleResponse(plan, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}