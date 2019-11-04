import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groups').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groups/' + id).then(res => res.data)
  }
}
