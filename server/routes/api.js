const express = require("express")
const router = express.Router()
const eventService = require("../services/event.service")

router.get("/events", eventService.getAll.bind(eventService))
router.get("/events/:eventId", eventService.getById.bind(eventService))

module.exports = router