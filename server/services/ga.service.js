var net = require('net')

var Plan = require('../models/plan.model')
var ForbiddenSeat = require('../models/forbiddenSeat.model')
var Group = require('../models/group.model')

var generating = []
module.exports = {
    generate (eventId, planId) {
        var promise = new Promise(function (resolve, reject) {
            // on récupère tous les plans nécessaire
            var plans = []
            if (planId) {
                plans = Plan.findAll({
                    where: {id: planId},
                    include: [
                        {
                            model: ForbiddenSeat,
                            as: ForbiddenSeat.tableName
                        },
                        {
                            model: Group,
                            as: Group.tableName
                        }
                    ]
                })
            } else {
                plans = Plan.findAll({
                    include: [
                        {
                            model: ForbiddenSeat,
                            as: ForbiddenSeat.tableName
                        },
                        {
                            model: Group,
                            as: Group.tableName
                        }
                    ]
                })
            }

            plans.then(plans => {

                for (var p in plans) {
                    var plan = plans[p]

                    // on check si le plan est déjà en génération
                    var planAlreadyGen = generating.filter(gen => {
                        return gen.eventId === eventId && gen.planId === plan.id
                    })
                    planAlreadyGen = planAlreadyGen.length > 0

                    if (!planAlreadyGen) {
                        // on enregistre le plan généré
                        generating.push({
                            eventId: eventId,
                            planId: plan.id,
                            percent: 0 
                        })

                        var client = new net.Socket()
                        client.on('error', function(ex) {
                            // generating est le meme MOINS l'element juste ajouté
                            generating = generating.filter((gen, i, arr) => {
                                return !(gen.eventId === eventId && gen.planId === plan.id)
                            })
                            console.log("connection error: " + ex)
                            resolve("Node not connected to GA server")
                        })
                        
                        client.connect({port: 65432, host: "localhost"})
                        
                        client.on('connect', function() {
                            console.info('Node connected to GA server')
                            client.write(JSON.stringify(plan.get({plain: true})))
                        })
                    
                        client.on('data', function(data) {
                            console.info('Received: ' + data)
                            resolve(data)
                            client.destroy()
                        })
                        
                        client.on('close', function() {
                            console.info('Connection closed')
                            // setTimeout(() => {
                            //     client.connect({port: 65432})
                            // }, 1000);
                        })
                    }
                }
            })
        })

        return promise
    },

    getGenerating () {
        return generating
    }
}