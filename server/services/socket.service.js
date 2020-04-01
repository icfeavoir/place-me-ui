const socketIo = require('socket.io')

const gaService = require('./ga.service')

var io = null
module.exports = {
    start (server) {
        // Chargement de socket.io
        io = socketIo.listen(server)
        // Quand un client se connecte, on le note dans la console
        io.sockets.on('connection', function (socket) {

            socket.on('msg', msg => {
                console.log('on me dit : ' + msg)
            })

            setInterval(() => socket.emit('msg', gaService.getGenerating()), 3000)
        })
    },
    send (msg) {
        var sockets = io.sockets.sockets
        for (var i in sockets) {
            sockets[i].emit('msg', msg)
        }
    }
}