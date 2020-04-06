const {Sequelize, sequelize} = require('../config/db')
const Event = require('../models/event.model')
const Plan = require('../models/plan.model')
const EventPlan = require('../models/eventPlan.model')
const Group = require('../models/group.model')
const GroupSeat = require('../models/groupSeat.model')

const gaService = require('./ga.service')

module.exports = {
    getAll (req, res) {
        Event.findAll().then(event => {
            this._handleResponse(event, res)
        })
    },
    getEvent (id) {
        return Event.findByPk(id)
    },
    getById (req, res) {
        this.getEvent(req.params.eventId)
            .then(event => {
                this._handleResponse(event, res)
            })
    },
    
    getPlansPrivate (req) {
        return EventPlan.findAll({include: [Event, Plan], where: {event_id: req.params.eventId}})
    },
    getPlans (req, res) {
        this.getPlansPrivate(req).then(eventPlans => {
            this._handleResponse(eventPlans, res)
        })
    },
    getNoPlans (req, res) {
        this.getPlansPrivate(req).then(eventPlan => {
            let existingPlans = []
            eventPlan.forEach(ep => existingPlans.push(ep.plan_id))
            Plan.findAll({where: {
                    id: {[Sequelize.Op.notIn]: existingPlans}
                }})
                .then(plans => {
                    this._handleResponse(plans, res)
                })
        })
    },

    addPlan (req, res) {
        let params = req.body || req || []
        if (!params.eventId || !params.planId) {
            this._handleResponse({error: 'Aucun plan sélectionné'}, res)
            return
        }
        let data = {
            event_id: params.eventId,
            plan_id: params.planId
        }
        // on vérifie si le plan est pas déjà lié
        let verif = EventPlan.count({where: data})
        verif.then(count => {
            if (count > 0) {
                this._handleResponse({error: 'Plan déjà lié à l\'événement'}, res)
                return
            } else {
                EventPlan.create(data)
                    .then(ep => {
                        let result = {
                            success: true,
                            data: ep
                        }
                        this._handleResponse(result, res)
                        // on génére un placement vide pour gagner du temps
                        Plan.findByPk(params.planId).then(plan => {
                            let groupSeats = []
                            for (var line = 0; line < plan.height; line++) {
                                for (var cell = 0; cell < plan.width; cell++) {
                                    groupSeats.push({
                                        event_plan_id: ep.id,
                                        group: null,
                                        line: line,
                                        cell: cell
                                    })
                                }
                            }
                            GroupSeat.bulkCreate(groupSeats)
                        })
                    })
                    .catch(e => {
                        console.error("ERROR EVENT PLAN CREATE: " + e)
                        result.error = "Cannot create event plan"
                        this._handleResponse(result, res)
                    })
            }
        })
    },
    deletePlan (req, res) {
        let params = req.body || req || []
        if (!params.eventId || !params.planId) {
            this._handleResponse({error: 'Aucun plan sélectionné'}, res)
            return
        }
        let data = {
            event_id: params.eventId,
            plan_id: params.planId
        }
        EventPlan.destroy({where: data})
            .then(ep => {
                this._handleResponse({success: true}, res)
            })
            .catch(e => {
                console.error("ERROR EVENT PLAN DELETE: " + e)
                result.error = "Cannot delete event plan"
                this._handleResponse(result, res)
            })
    },
    
    getBook (req, res) {
        Group.findAll({
            where: {event_id: req.params.eventId},
            attributes: ['event_id', 'plan_id', [sequelize.fn('sum', sequelize.col('number')), 'total']],
            group : ['group.plan_id'],
            raw: true,
        }).then(data => {
            let result = []
            let count = 0
            data.forEach(d => {
                d.total = parseInt(d.total)
                result[d.plan_id] = d
                count += d.total
            })
            result[0] = count   // on met le total en plan 0
            this._handleResponse(result, res)
        })
    },

    generate (req, res) {
        var eventId = req.body.eventId
        var planId = req.body.planId || null
        gaService.generate(eventId, planId).then(data => {
            this._handleResponse(data, res)
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
            Event.create(params)
                .then(event => {
                    result.success = true
                    result.data = event
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR EVENT CREATE: " + e)
                    result.error = "Cannot create event"
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
            result = "No event id"
        } else {
            // on check tout
            params.id = parseInt(params.id)
            var {result, params} = this.checkData(params)
        }

        if (result === true) {
            // on peut modifier
            this.getEvent(params.id).then(event => {
                event.update(params)
                    .then(updatedEvent => {
                        result.success = true
                        result.data = updatedEvent
                        this._handleResponse(result, res)
                    })
                    .catch(e => {
                        console.error("ERROR EVENT UPDATE: " + e)
                        result.error = "Cannot update event"
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
            result.error = "No event id"
        }

        if (!result.error) {
            // on supprime
            Event.destroy({where: {id: params.id}})
                .then(() => {
                    result.success = true
                    this._handleResponse(result, res)
                })
                .catch(e => {
                    console.error("ERROR EVENT DELETE: " + e)
                    result.error = "Cannot delete event"
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
        if (!params.date || params.date === '') {
            return {result: "Need a date", params: params}
        } else if (isNaN(Date.parse(params.date))) {
            return {result: "Date invalide", params: params}
        }
        return {result: true, params: params}
    }
}