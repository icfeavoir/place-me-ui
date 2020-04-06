const GroupSeat = require('../models/groupSeat.model')
const EventPlan = require('../models/eventPlan.model')

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
    },

    getByEventPlan (req, res) {
        var params = req.body || req || []
        if (!params.event_id || !params.plan_id) {
            this._handleResponse({error: 'No event or plan'}, res)
        }
        
        this.getEventPlanId(params).then(ep => {
            let eventPlanId = ep.id
            GroupSeat.findAll({where: {event_plan_id: eventPlanId}})
                .then(groupSeats => {
                    this._handleResponse(groupSeats, res)
                })
                .catch(e => {
                    console.error("ERROR GROUP SEAT GET BY EVENT PLAN: " + e)
                    this._handleResponse({error: "Cannot get group seats"}, res)
                })
        })
    },
    
    setGroupSeat (req, res) {
        var params = req.body || req || []
        this.checkData(params).then(data => {
            let result = data.result
            params = data.params
            if (result === true) {
                // tout est ok
                result = {}
                // on met forcément params sous forme d'un tableau de modifs
                if (!Array.isArray(params)) {
                    params = [params]
                }
                let allFindGroupSeats = []
                params.forEach(param => {
                    // on check si le groupSeat existe, on sait jamais
                    let where = {
                        event_plan_id: param.event_plan_id,
                        line: param.line,
                        cell: param.cell
                    }
                    allFindGroupSeats.push(GroupSeat.findOne({where: where}))
                })

                Promise.all(allFindGroupSeats).then(groupSeats => {
                    let allRequests = []
                    let count = 0
                    groupSeats.forEach(gs => {
                        let param = params[count]
                        let where = {
                            event_plan_id: param.event_plan_id,
                            line: param.line,
                            cell: param.cell
                        }
                        // request selon si le seat existe
                        let request = gs === null ?
                            GroupSeat.create(param) :
                            GroupSeat.update({group_id: param.group_id}, {where: where})
                        allRequests.push(request)
                        count++
                    })

                    // toutes les requêtes sont prêtes
                    Promise.all(allRequests).then(groupSeats => {
                        result.success = true
                        this._handleResponse(result, res)
                        console.log('all done')
                    }).catch(e => {
                        console.error("ERROR GROUP SEAT UPDATE: ")
                        console.error(e)
                        result.error = "Cannot update groupSeat"
                        this._handleResponse(result, res)
                    })
                })
            } else {
                this._handleResponse({error: result}, res)
            }
        })
    },

    getEventPlanId (params) {
        return params.event_plan_id ? 
            new Promise((s,f) => s({id: params.event_plan_id})) :
            EventPlan.findOne({where: {event_id: params.event_id, plan_id: params.plan_id}})
    },
    checkData (params, severalGroups = false) {
        let promise
        if ('groups' in params) {
            promise = new Promise((resolve, reject) => {
                // plusieurs groupes d'un coup
                if (!params.event_plan_id && (!params.event_id || !params.plan_id)) {
                    resolve({result: "No event plan id", params: params})
                }
                if (!Array.isArray(params.groups)) {
                    resolve({result: "groups no array", params: params})
                }
                // on récupère l'event_plan_id
                this.getEventPlanId(params).then(res => {
                    let eventPlanId = res.id
                    // si c'est un tableau de groups, on refait le test pour chaque elem
                    for (let i = 0; i < params.groups.length; i++) {
                        data = params.groups[i]
                        // on remet en forme pour chaque data
                        data.event_plan_id = eventPlanId
                        this.checkData(data, true).then(res => {
                            if (res.result !== true) {
                                // une des valeurs est fausse, on retourne l'erreur (et stop la boucle)
                                res.info = "Error check with array"
                                resolve(res)
                            }
                        })
                    }
                    // et enfin on sort le tableau pour le bulkCreate
                    params = params.groups
                    resolve({result: true, params: params})
                })
            })
        } else {
            promise = new Promise((resolve, reject) => {
                if (!params.group_id) {
                    resolve({result: "No group id", params: params})
                }
                if (!('line' in params) || !Number.isInteger(params.line)) {
                    resolve({result: "No line", params: params})
                }
                if (!('cell' in params) || !Number.isInteger(params.cell)) {
                    resolve({result: "No cell", params: params})
                }

                // on check event_plan_id si c'est pas un tableau
                if (!severalGroups) {
                    if (!params.event_plan_id && (!params.event_id || !params.plan_id)) {
                        resolve({result: "No event plan id", params: params})
                    }
                }
            })
        }
        return promise
    }
}