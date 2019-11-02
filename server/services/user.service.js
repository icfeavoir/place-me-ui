const User = require('../models/user.model')

module.exports = {
    getAll (req, res) {
        User.findAll().then(users => {
            console.log(users)
            this._handleResponse(users, res)
        })
    },
    getById (req, res) {
        User.findOne({id: req.params.userId}).then(user => {
            console.log(user)
            this._handleResponse(user, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}