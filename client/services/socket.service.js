import io from 'socket.io-client'

var socket = null
var isConnected = false

export default {
  connect () {
    return new Promise((resolve, reject) => {
      socket = io('localhost:3000')
      socket.on('disconnect', () => {
        isConnected = false
      })
      socket.on('msg', data => this.handle(data))
      socket.on('connect', () => {
        isConnected = true
      })
    })
  },
  send (room, msg) {
    if (!isConnected) {
      this.connect(this.send(room, msg))
    }
    socket.emit(room, msg)
  },
  handle (data) {
    // console.info("socket: " + data)
  }
}
