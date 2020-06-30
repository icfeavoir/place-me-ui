const {Sequelize, sequelize} = require('../config/db')
const Setting = require('../models/setting.model')

module.exports = {
    getAll (req, res) {
        Setting.findAll().then(settings => {
            this._handleResponse(settings, res)
        })
    },
    getSetting (id) {
        return Setting.findByPk(id)
    },
    getById (req, res) {
        this.getSetting(req.params.settingId).then(setting => {
            this._handleResponse(setting, res)
        })
    },
    getByName (req, res) {
        if (!req.params.name) {
            this._handleResponse({error: 'No setting name'}, res)
            return
        }
        Setting.findOne({where: {name: req.params.name}}).then(setting => {
            this._handleResponse(setting, res)
        })
    },

    set (req, res) {
        var params = req.body || req || []
        if (!params.name) {
            this._handleResponse({error: 'No setting name'}, res)
            return
        }
        if (!params.value) {
            this._handleResponse({error: 'No setting value'}, res)
            return
        }

        switch (params.name) {
            case 'plan_default_size':
                let val = Number.parseInt(params.value)
                if (Number.isNaN(val) || val < 10 || val > 100) {
                    this._handleResponse({error: 'La valeur doit être un entier entre 1 et 100'}, res)
                    return
                }
                break
        }

        // Set or Create
        Setting.findOne({where: {name: params.name}}).then(setting => {
            if (setting) {
                setting.update({value: params.value}).then(upd => {
                    this._handleResponse({success: true, setting: upd}, res)
                }).catch(e => {
                    console.error("ERROR update settings: " + e)
                    this._handleResponse({error: 'Cannot update settings'}, res)
                })
            } else {
                Setting.create({name: params.name, value: params.value}).then(setting => {
                    this._handleResponse({success: true, setting: setting}, res)
                }).catch(e => {
                    console.error("ERROR update settings: " + e)
                    this._handleResponse({error: 'Cannot update settings'}, res)
                })
            }
        })
    },

    _handleResponse (data, res) {
        res.send(data)
    }
}