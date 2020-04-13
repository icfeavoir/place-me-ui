const {Sequelize, sequelize} = require('../config/db')
const Plan = require('../models/plan.model')
const ForbiddenSeat = require('../models/forbiddenSeat.model')

module.exports = {
    getAll (req, res) {
        Plan.findAll().then(plans => {
            this._handleResponse(plans, res)
        })
    },
    getPlan (id) {
        return Plan.findByPk(id)
    },
    getById (req, res) {
        this.getPlan(req.params.planId)
            .then(plan => {
                this._handleResponse(plan, res)
            })
    },
    countSeats (req, res) {
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
    },

    create (req, res) {
        var params = req.body || req || []
        var {result, params} = this.checkData(params)

        if (result === true) {
            result = {}
            // tout est ok
            Plan.create(params)
                .then(plan => {
                    result.success = true
                    result.data = plan
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR PLAN CREATE: " + e)
                    result.error = "Cannot create plan"
                    this._handleResponse(result, res)
                })
        } else {
            this._handleResponse({error: result}, res)
        }
    },

    update (req, res) {
        var params = req.body || req || []
        var result = ''
        if (!params.id) {
            result = "No plan id"
        } else {
            // on check tout
            params.id = parseInt(params.id)
            var {result, params} = this.checkData(params)
        }

        if (result === true) {
            // on peut modifier
            this.getPlan(params.id).then(plan => {
                plan.update(params)
                    .then(updatedPlan => {
                        result.success = true
                        result.data = updatedPlan
                        this._handleResponse(result, res)
                    })
                    .catch(e => {
                        console.error("ERROR PLAN UPDATE: " + e)
                        result.error = "Cannot update plan"
                        this._handleResponse(result, res)
                    })
            })
        } else {
            this._handleResponse({error: result}, res)
        }
    },

    delete (req, res) {
        let params = req.body || req || []
        let del = {}
        if (params.id) {
            del = {id: params.id}
        }
        // on supprime
        Plan.destroy({where: del}).then(() => {
            this._handleResponse({success: true}, res)
        }).catch(e => {
            console.error("ERROR PLAN DELETE: " + e)
            this._handleResponse({error: 'Cannot delete plan'}, res)
        })
    },

    checkData (params) {
        if (!params.name || params.name.length < 4) {
            return {result: "Name too short (min = 4)", params: params}
        }
        if (!params.line || params.line < 1) {
            return {result: "Line number", params: params}
        } else if (isNaN(parseInt(params.line))) {
            return {result: "Nombre de lignes invalide", params: params}
        }
        if (!params.cell || params.cell < 1) {
            return {result: "Cell number", params: params}
        } else if (isNaN(parseInt(params.cell))) {
            return {result: "Nombre de sièges invalide", params: params}
        }
        params.height = params.line
        params.width = params.cell
        // après avoir renommé, on suppr les keys inutiles
        delete params.line
        delete params.cell
        return {result: true, params: params}
    }
}