import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/settings').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/settings/' + id).then(res => res.data)
  },
  getByName (name) {
    return axios.get('/api/settings/getByName/' + name).then(res => res.data)
  },
  set (data) {
    return axios.post('/api/settings/set', data).then(res => res.data)
  }
}
