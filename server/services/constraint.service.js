const Constraint = require('../models/constraint.model')
const ConstraintSeat = require('../models/constraintSeat.model')
const Group = require('../models/group.model')

module.exports = {
    getAll (req, res) {
        Constraint.findAll().then(constraints => {
            this._handleResponse(constraints, res)
        })
    },
    getConstraint (id) {
        return Constraint.findByPk(id)
    },
    getById (req, res) {
        this.getConstraint(req.params.constraintId)
            .then(constraint => {
                this._handleResponse(constraint, res)
            })
    },
    getByPlan (req, res) {
        ConstraintSeat.findAll({where: {plan_id: req.params.planId}}).then(constraintSeats => {
            this._handleResponse(constraintSeats, res)
        })
    },
    fusion (req, res) {
        var params = req.body || req || []
        if (!params.mainConstraintId || !params.constraintId) {
            this._handleResponse({error: 'Manque une contrainte'}, res)
            return
        }

        // on modifie d'abord tous les contraint_seats et les groups
        let requests = [
            ConstraintSeat.update({constraint_id: params.mainConstraintId}, {where: {constraint_id: params.constraintId}}),
            Group.update({constraint_id: params.mainConstraintId}, {where: {constraint_id: params.constraintId}}),
        ]
        Promise.all(requests).then(() => {
            Constraint.destroy({where: {id: params.constraintId}}).then(deleted => {
                this._handleResponse({success: true, deletedId: params.constraintId}, res)
            })
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
            Constraint.create(params)
                .then(constraint => {
                    result.success = true
                    result.data = constraint
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR CONSTRAINT CREATE: " + e)
                    result.error = "Cannot create constraint"
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
            result = "No constraint id"
        } else {
            // on check tout
            params.id = parseInt(params.id)
            var {result, params} = this.checkData(params)
        }

        if (result === true) {
            // on peut modifier
            this.getConstraint(params.id).then(constraint => {
                constraint.update(params)
                    .then(updatedConstraint => {
                        this._handleResponse({
                            success: true,
                            data: updatedConstraint
                        }, res)
                    })
                    .catch(e => {
                        console.error("ERROR CONSTRAINT UPDATE: " + e)
                        result.error = "Cannot update constraint"
                        this._handleResponse(result, res)
                    })
            })
        } else {
            this._handleResponse({error: result}, res)
        }
    },

    delete (req, res) {
        var params = req.body || req || []
        var result = {}
        if (!params.id) {
            result.error = "No constraint id"
        }

        if (!result.error) {
            // on supprime
            Constraint.destroy({where: {id: params.id}})
                .then(() => {
                    result.success = true
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR CONSTRAINT DELETE: " + e)
                    result.error = "Cannot delete constraint"
                    this._handleResponse(result, res)
                })
        } else {
            this._handleResponse(result, res)
        }
    },

    checkData (params) {
        if (!params.name || params.name.length < 4) {
            return {result: "Name too short (min = 4)", params: params}
        }
        return {result: true, params: params}
    }
}