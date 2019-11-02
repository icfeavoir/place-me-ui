import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/users').then(res => res.data)
  },
  findById (userId) {
    return axios.get('/api/users/' + userId).then(res => res.data)
  }
}
