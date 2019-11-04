import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groupSeats').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groupSeats/' + id).then(res => res.data)
  }
}
