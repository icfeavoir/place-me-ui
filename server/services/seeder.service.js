const faker = require('faker')
const {Sequelize, sequelize} = require('../config/db')
const Event = require('../models/event.model')
const Group = require('../models/group.model')
const Plan = require('../models/plan.model')
const Constraint = require('../models/constraint.model')
const ConstraintSeat = require('../models/constraintSeat.model')
const ForbiddenSeat = require('../models/forbiddenSeat.model')
const EventPlan = require('../models/eventPlan.model')

module.exports = {
    seedData (seed) {
        console.log('CREATING DB')
        sequelize.sync({force: true}).then(() => {
            if (seed) {
                console.log('SEEDING DB')
                this.createEvents()
            }
        })
    },

    createEvents () {
        const it = this
        Event.bulkCreate([
            {
                name: "Vendredi",
                date: new Date(),
            },
            {
                name: "Samedi",
                date: new Date(),
            }
        ])
        .then(e => {
            it.createPlans(e.map(a => a.id))
        })
        .catch(e => console.error("EVENT ERROR: " + e))
    },

    createPlans (events) {
        const it = this
        Plan.bulkCreate([
            {
                name: "Gradins",
                width: 24,
                height: 9
            },
            {
                name: "Chaises",
                width: 16,
                height: 10
            }
        ])
        .then(plans => {
            plans.forEach(p => {
                events.forEach(eventId => {
                    EventPlan.create({
                        event_id: eventId,
                        plan_id: p.id
                    })
                })
            })
            it.createGroups(events, plans.map(p => p.id))
            it.createForbiddenSeats(plans)
            it.createConstraints(plans)
        })
        .catch(e => console.error("Plan ERROR: " + e))

    },

    createGroups (events, plans) {
        const NB_GROUPS = 50
        var groups = []
        for (var i=0; i<NB_GROUPS; i++) {
            let color = '#' + (Math.floor(Math.random()*16777215)).toString(16)
            while (color.length < 7) {
                color += '0'
            }
            groups.push({
                name: faker.name.firstName() + ' ' + faker.name.lastName(),
                number: faker.random.number({min: 1, max: 20}),
                color: color,
                plan_id: plans[Math.floor(Math.random() * plans.length)],
                event_id: events[Math.floor(Math.random() * events.length)],
            })
        }

        Group.bulkCreate(groups).catch(e => console.error("GROUP ERROR: " + e))
    },

    createForbiddenSeats (plans) {
        var forbidden = []

        Plan.findOne({where: {name: 'Gradins'}}).then(plan => {
            let cells = [6, 7, 16, 17]
            for (let line = 1; line < plan.height; line++) {
                cells.forEach(cell => {
                    forbidden.push({
                        plan_id: plan.id,
                        line: line,
                        cell: cell,
                    })
                })
            }
            ForbiddenSeat.bulkCreate(forbidden).catch(e => console.error("FORBIDDEN ERROR: " + e))
        })

        Plan.findOne({where: {name: 'Chaises'}}).then(plan => {
            let cells = [7, 8]
            for (let line = 0; line < plan.height; line++) {
                cells.forEach(cell => {
                    forbidden.push({
                        plan_id: plan.id,
                        line: line,
                        cell: cell,
                    })
                })
            }
            ForbiddenSeat.bulkCreate(forbidden).catch(e => console.error("FORBIDDEN ERROR: " + e))
        })
    },

    createConstraints (plans) {
        const it = this

        Constraint.bulkCreate([
            {
                name: "Premier rang"
            },
            {
                name: "Place fauteuil"
            },
        ])
        .then(constraints => {
            it.createConstraintSeats(plans, constraints)
        })
        .catch(e => console.error("FORBIDDEN ERROR: " + e))
    },

    createConstraintSeats (plans, constraints) {
        for (var p in plans) {
            var plan = plans[p]
            for (var c in constraints) {
                var constraint = constraints[c]
                switch (constraint.id) {
                    case 1:
                        // PREMIER RANG
                        let premierRang = []
                        for (let i = 0; i < plan.width; i++) {
                            premierRang.push(
                                {
                                    plan_id: plan.id,
                                    constraint_id: constraint.id,
                                    line: plan.height - 1,
                                    cell: i,
                                }
                            )
                        }
                        ConstraintSeat.bulkCreate(premierRang)
                        break;

                    case 2:
                        // FAUTEUIL
                        ConstraintSeat.create({
                                plan_id: plan.id,
                                constraint_id: constraint.id,
                                line: plan.height - 1,
                                cell: plan.width - 1,
                            })
                        break;
                }
            }
        }

        console.log('READY TO GO!')
    }
}