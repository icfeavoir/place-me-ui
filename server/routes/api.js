const express = require("express")
const router = express.Router()

const eventService = require("../services/event.service")
const groupService = require("../services/group.service")
const groupSeatService = require("../services/groupSeat.service")
const planService = require("../services/plan.service")
const constraintService = require("../services/constraint.service")
const forbiddenSeatService = require("../services/forbiddenSeat.service")
const eventPlanService = require("../services/eventPlan.service")

router.get("/events", eventService.getAll.bind(eventService))
router.get("/events/:eventId", eventService.getById.bind(eventService))
router.get("/eventNoPlans/:eventId", eventService.getNoPlans.bind(eventService))
router.post("/events/generate", eventService.generate.bind(eventService))
router.post("/events/create", eventService.create.bind(eventService))
router.post("/events/update", eventService.update.bind(eventService))
router.post("/events/addPlan", eventService.addPlan.bind(eventService))
router.post("/events/deletePlan", eventService.deletePlan.bind(eventService))
router.delete("/events/delete", eventService.delete.bind(eventService))

router.get("/groupSeats", groupSeatService.getAll.bind(groupSeatService))
router.get("/groupSeats/:groupSeatId", groupSeatService.getById.bind(groupSeatService))
// router.post("/groupSeats/getByEventPlan", groupSeatService.getByEventPlan.bind(groupSeatService))
router.post("/groupSeats/setGroupSeat", groupSeatService.setGroupSeat.bind(groupSeatService))
router.post("/groupSeats/getByEventPlanId", groupSeatService.getByEventPlanId.bind(groupSeatService))
router.post("/groupSeats/getByEventPlanIdAndGroupId", groupSeatService.getByEventPlanIdAndGroupId.bind(groupSeatService))

router.get("/groups", groupService.getAll.bind(groupService))
router.get("/groups/:groupId", groupService.getById.bind(groupService))
router.get("/countGroupByEvent", groupService.countGroupByEvent.bind(groupService))
router.post("/groups/create", groupService.create.bind(groupService))
router.post("/groups/update", groupService.update.bind(groupService))
router.post("/groups/getByEventPlanId", groupService.getByEventPlanId.bind(groupService))
router.delete("/groups/delete", groupService.delete.bind(groupService))

router.get("/plans", planService.getAll.bind(planService))
router.get("/plans/:planId", planService.getById.bind(planService))
router.get("/countSeats", planService.countSeats.bind(planService))
router.post("/plans/create", planService.create.bind(planService))
router.post("/plans/update", planService.update.bind(planService))
router.delete("/plans/delete", planService.delete.bind(planService))

router.get("/constraints", constraintService.getAll.bind(constraintService))
router.get("/constraints/:constraintId", constraintService.getById.bind(constraintService))

router.get("/forbiddenSeats", forbiddenSeatService.getAll.bind(forbiddenSeatService))
router.get("/forbiddenSeats/:forbiddenSeatId", forbiddenSeatService.getById.bind(forbiddenSeatService))
router.get("/forbiddenSeatsByPlan/:planId", forbiddenSeatService.getByPlanId.bind(forbiddenSeatService))
router.post("/forbiddenSeatsByPlan/update", forbiddenSeatService.update.bind(forbiddenSeatService))

router.get("/eventPlans", eventPlanService.getAll.bind(eventPlanService))
router.get("/eventPlans/:id", eventPlanService.getById.bind(eventPlanService))
router.get("/eventPlansByEventId/:eventId", eventPlanService.getByEventId.bind(eventPlanService))

module.exports = router