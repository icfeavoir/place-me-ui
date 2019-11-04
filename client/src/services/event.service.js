import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/events').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/events/' + id).then(res => res.data)
  }
}
