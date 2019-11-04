import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/plans').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/plans/' + id).then(res => res.data)
  }
}
