const {Sequelize, sequelize} = require('../config/db')
const Group = require('../models/group.model')
const GroupSeat = require('../models/groupSeat.model')
const Constraint = require('../models/constraint.model')

module.exports = {
    getAll (req, res) {
        Group.scope(['defaultScope', 'orderByName']).findAll().then(groups => {
            this._handleResponse(groups, res)
        })
    },
    getGroup (id) {
        return Group.findByPk(id)
    },
    getById (req, res) {
        this.getGroup(req.params.groupId)
            .then(group => {
                this._handleResponse(group, res)
            })
    },
    getByEventPlanId (req, res) {
        let params = req.body || req || []
        let eventPlanId = params.eventPlanId
        Group.scope(['defaultScope', 'orderByName']).findAll({where: {event_plan_id: eventPlanId}})
            .then(groups => {
                this._handleResponse(groups, res)
            })
            .catch(e => {
                console.error("ERROR GROUP GET BY EVENT PLAN: " + e)
                this._handleResponse({error: "Cannot get group"}, res)
            })
    },
    countGroupByEvent (req, res) {
        Group.scope('eventPlanOnly').findAll({
            attributes: ['event_plan_id', [sequelize.fn('sum', sequelize.col('number')), 'total']],
            group : ['group.event_plan_id'],
            raw: true,
        }).then(total => {
            this._handleResponse(total, res)
        })
    },

    create (req, res) {
        var params = req.body || req || []
        var {result, params} = this.checkData(params)

        if (result === true) {
            // tout est ok
            result = {}
            // on génère une couleur aléatoire (16777215 = ffffff en hex)
            params.color = '#' + Math.floor(Math.random()*16777215).toString(16);
            while (params.color.length < 7) {
                params.color += '0'
            }
            // on check s'il faut créer une contrainte ou si elle existe déjà
            this.findOrCreateConstraint(params.constraint_name)
                .then(([constraint, created]) => {
                    delete params.constraint_name
                    // SI CONTRAINTE
                    if (constraint) {
                        // on remet soit l'id trouvé, soit celui créé
                        params.constraint_id = constraint.id
                    } else {
                        params.constraint_id = null
                    }
                    Group.create(params)
                        .then(group => {
                            result.success = true
                            result.data = group
                            this._handleResponse(result, res)
                        })
                        .catch(e => {
                            console.error("ERROR GROUP CREATE: " + e)
                            result.error = "Cannot create group"
                            this._handleResponse(result, res)
                        })
                })
        } else {
            this._handleResponse({error: result}, res)
        }
    },

    update (req, res) {
        var params = req.body || req || []
        var result = ''
        if (!params.id) {
            result = "No group id"
        } else {
            // on check tout
            params.id = parseInt(params.id)
            var {result, params} = this.checkData(params)
        }
        if (result === true) {
            // on peut modifier
            this.getGroup(params.id).then(group => {
                // on check s'il faut créer une contrainte ou si elle existe déjà
                this.findOrCreateConstraint(params.constraint_name)
                    .then(([constraint, created]) => {
                        // SI CONTRAINTE
                        delete params.constraint_name
                        if (constraint) {
                            // on remet soit l'id trouvé, soit celui créé
                            params.constraint_id = constraint.id
                        } else {
                            params.constraint_id = null
                        }
                        group.update(params)
                            .then(updatedGroup => {
                                let request
                                let changeEventPlan = false
                                if ('event_plan_id' in updatedGroup._changed) {
                                    changeEventPlan = true
                                    // on a change l'événement ou le plan de ce groupe, il faut le suppr du plan actuel
                                    request = GroupSeat.findAll({where: {group_id: updatedGroup.id}})
                                } else {
                                    request = GroupSeat.findAll({
                                        where: {group_id: updatedGroup.id},
                                        offset: parseInt(updatedGroup.number),
                                        order: [['line'], ['cell']] // on ordonne dans l'ordre pour le offset
                                    })
                                }
                                // on recup les groups Seats à suppr
                                let refreshPlan = false
                                request.then(groupSeats => {
                                    groupSeats.forEach(groupSeat => {
                                        refreshPlan = true
                                        GroupSeat.destroy({where: {id: groupSeat.id}})
                                    })
                                    // on renvoie le groupe
                                    this._handleResponse({
                                        success: true,
                                        data: updatedGroup,
                                        changes: updatedGroup._changed,
                                        refreshPlan: refreshPlan,
                                        changeEventPlan: changeEventPlan
                                    }, res)
                                })
                            })
                            .catch(e => {
                                console.error("ERROR GROUP UPDATE: " + e)
                                result.error = "Cannot create group"
                                this._handleResponse(result, res)
                            })
                })
            })
        } else {
            this._handleResponse({error: result}, res)
        }
    },

    delete (req, res) {
        let params = req.body || req || []
        let result = {}
        if (!params.id) {
            result.error = "No group id"
        }

        if (!result.error) {
            // on supprime
            Group.destroy({where: {id: params.id}})
                .then(() => {
                    result.success = true
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR GROUP DELETE: " + e)
                    result.error = "Cannot delete group"
                    this._handleResponse(result, res)
                })
        } else {
            this._handleResponse(result, res)
        }
    },

    _handleResponse (data, res) {
        res.send(data)
    },

    findOrCreateConstraint (constraintName) {
        if (constraintName && constraintName !== '') {
            return Constraint.findOrCreate({where: {name: constraintName}})
        } else {
            return new Promise((res, rej) => res([null, false]))
        }
    },

    checkData (params) {
        if (!params.name || params.name.length < 4) {
            return {result: "Name too short (min = 4)", params: params}
        }
        if (!params.number || params.number <= 0) {
            return {result: "Number should be > 0", params: params}
        }
        if (!params.event_plan_id || params.event_plan_id <= 0) {
            return {result: "no event plan", params: params}
        }

        if (!params.constraint_name) {
            params.constraint_number = 0 // personne en contrainte
        } else {
            if (params.constraint_number <= 0 || params.constraint_number > params.number) {
                return {result: "constraint number is wrong", params: params}
            } else {
                try {
                    params.constraint_number = parseInt(params.constraint_number)
                } catch (e) {
                    return {result: "constraint number is wrong", params: params}
                }
            }
        }
        return {result: true, params: params}
    }
}