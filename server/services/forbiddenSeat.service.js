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
    update (req, res) {
        // on vérifie le plan associé
        var params = req.body || req || []
        var result = ''
        if (!params.planId) {
            result = "No plan id"
        } else {
            params.planId = parseInt(params.planId)
            result = true
        }

        if (result === true) {
            // on supprime tous les forbiddenSeats de ce plan puis on les rajoute
            ForbiddenSeat.destroy({where: {plan_id: params.planId}})
                .then(() => {
                    // on rajoute tous les sièges donnés
                    var fseats = []
                    if (params.forbiddenSeats) {
                        for (var i in params.forbiddenSeats) {
                            var fseat = params.forbiddenSeats[i]
                            fseats.push({
                                plan_id: params.planId,
                                line: fseat.line,
                                cell: fseat.cell
                            })
                        }

                        ForbiddenSeat.bulkCreate(fseats)
                            .then(fseats => {
                                result.success = true
                                result.data = fseats
                                this._handleResponse(result, res)
                            })
                    }
                })
        } else {
            this._handleResponse({error: result}, res)
        }

    },
    _handleResponse (data, res) {
        res.send(data)
    }
}