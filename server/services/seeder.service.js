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
            it.createGroups(events, plans.map(p => p.id))
            it.createForbiddenSeats(plans)
            it.createConstraints(plans)
        })
        .catch(e => console.error("Plan ERROR: " + e))

    },

    createGroups (events, plans) {
        const NB_GROUPS = 1
        var groups = []
        for (var i=0; i<NB_GROUPS; i++) {
            groups.push({
                name: faker.name.firstName() + ' ' + faker.name.lastName(),
                number: faker.random.number({min: 5, max: 20}),
                plan_id: plans[Math.floor(Math.random() * plans.length)],
                event_id: events[Math.floor(Math.random() * events.length)],
            })
        }

        Group.bulkCreate(groups).catch(e => console.error("GROUP ERROR: " + e))
    },

    createForbiddenSeats (plans) {
        var forbidden = []

        for (var i=0; i<10; i++) {
            var plan = plans[Math.floor(Math.random() * plans.length)]
            forbidden.push({
                plan_id: plan.id,
                line: faker.random.number(plan.width),
                cell: faker.random.number(plan.height),
            })
        }

        ForbiddenSeat.bulkCreate(forbidden).catch(e => console.error("FORBIDDEN ERROR: " + e))
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
                switch (constraint.name) {
                    case 'p_rang':
                        ConstraintSeat.bulkCreate([
                            {
                                plan_id: plan.id,
                                constraint_id: constraint.id,
                                line: 0,
                                cell: 0,
                            },
                            {
                                plan_id: plan.id,
                                constraint_id: constraint.id,
                                line: 0,
                                cell: 1,
                            },
                            {
                                plan_id: plan.id,
                                constraint_id: constraint.id,
                                line: 0,
                                cell: 2,
                            },
                        ])
                        break;

                    case 'handic':
                        ConstraintSeat.create({
                                plan_id: plan.id,
                                constraint_id: constraint.id,
                                line: 0,
                                cell: p.width - 1,
                            })
                        break;
                }
            }
        }
    }
}