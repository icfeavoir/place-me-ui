const express = require("express")
const router = express.Router()

const eventService = require("../services/event.service")
const groupService = require("../services/group.service")
const groupSeatService = require("../services/groupSeat.service")
const planService = require("../services/plan.service")

router.get("/events", eventService.getAll.bind(eventService))
router.get("/events/:eventId", eventService.getById.bind(eventService))

router.get("/groupSeats", groupSeatService.getAll.bind(groupSeatService))
router.get("/groupSeats/:groupSeatId", groupSeatService.getById.bind(groupSeatService))

router.get("/groups", groupService.getAll.bind(groupService))
router.get("/groups/:groupId", groupService.getById.bind(groupService))

router.get("/plans", planService.getAll.bind(planService))
router.get("/plans/:planId", planService.getById.bind(planService))

module.exports = router