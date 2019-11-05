import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/constraints').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/constraints/' + id).then(res => res.data)
  }
}
