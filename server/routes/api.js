const express = require("express")
const router = express.Router()
const userService = require("../services/user.service")

router.get("/users", userService.getAll.bind(userService))
router.get("/users/:userId", userService.getById.bind(userService))

module.exports = router