const Group = require('../models/group.model')
const Event = require('../models/event.model')

module.exports = {
    getAll (req, res) {
        Group.findAll({include: [Event]}).then(groups => {
            console.log(groups.name)
            this._handleResponse(groups, res)
        })
    },
    getById (req, res) {
        Group.findOne({where: {id: req.params.groupId}}).then(group => {
            this._handleResponse(group, res)
        })
    },
    _handleResponse (data, res) {
        res.send(data)
    }
}