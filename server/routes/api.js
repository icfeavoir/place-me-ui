const express = require("express")
const router = express.Router()

const eventService = require("../services/event.service")
const groupService = require("../services/group.service")
const groupSeatService = require("../services/groupSeat.service")
const planService = require("../services/plan.service")
const constraintService = require("../services/constraint.service")
const forbiddenSeatService = require("../services/forbiddenSeat.service")

router.get("/events", eventService.getAll.bind(eventService))
router.get("/events/:eventId", eventService.getById.bind(eventService))
// router.post("/events/create", eventService.create.bind(eventService))

router.get("/groupSeats", groupSeatService.getAll.bind(groupSeatService))
router.get("/groupSeats/:groupSeatId", groupSeatService.getById.bind(groupSeatService))

router.get("/groups", groupService.getAll.bind(groupService))
router.get("/groups/:groupId", groupService.getById.bind(groupService))
router.post("/groups/create", groupService.create.bind(groupService))
router.post("/groups/update", groupService.update.bind(groupService))
router.delete("/groups/delete", groupService.delete.bind(groupService))

router.get("/plans", planService.getAll.bind(planService))
router.get("/plans/:planId", planService.getById.bind(planService))
// router.post("/plans/create", planService.create.bind(planService))

router.get("/constraints", constraintService.getAll.bind(constraintService))
router.get("/constraints/:constraintId", constraintService.getById.bind(constraintService))

router.get("/forbiddenSeats", forbiddenSeatService.getAll.bind(forbiddenSeatService))
router.get("/forbiddenSeats/:forbiddenSeatId", forbiddenSeatService.getById.bind(forbiddenSeatService))
router.get("/forbiddenSeatsByPlan/:planId", forbiddenSeatService.getByPlanId.bind(forbiddenSeatService))

module.exports = router