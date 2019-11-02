const faker = require('faker')
const User = require('../models/user.model')
const config = require('../config/index')

module.exports = {
    seedData () {
        this.createUsers()
    },
    createUsers () {
        let users = [];

        Array.from(Array(config.numberOfUsers)).forEach(() => {
            users.push({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            })
        })

        User.bulkCreate(users)
            .then(() => {
            console.log(User.findAll())
        })
    },
}