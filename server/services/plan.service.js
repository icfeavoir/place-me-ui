const {Sequelize, sequelize} = require('../config/db')
const Plan = require('../models/plan.model')
const ForbiddenSeat = require('../models/forbiddenSeat.model')

module.exports = {
    getAll (req, res) {
        Plan.findAll().then(plans => {
            this._handleResponse(plans, res)
        })
    },
    getById (req, res) {
        Plan.findOne({where: {id: req.params.planId}}).then(plan => {
            this._handleResponse(plan, res)
        })
    },
    countSeats (req,res) {
        let plans = Plan.findAll({
            attributes: ['id', [sequelize.literal('(width * height)'), 'total']],
            group : ['id'],
            raw: true,
        })

        let forbid = ForbiddenSeat.findAll({
            attributes: ['plan_id', [sequelize.literal('COUNT(*)'), 'total']],
            group : ['plan_id'],
            raw: true,
        })

        Promise.all([plans, forbid]).then(values => {
            let plans = values[0]
            let forbids = values[1]
            plans.forEach(p => {
                let forbid = forbids.find(f => f.plan_id === p.id)
                if (forbid) {
                    p.total -= forbid.total
                }
            })
            this._handleResponse(plans, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}