import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/plans').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/plans/' + id).then(res => res.data)
  },
  countSeats () {
    return axios.get('/api/countSeats').then(res => res.data)
  },
  create (data) {
    return axios.post('/api/plans/create', data).then(res => res.data)
  },
  update (data) {
    return axios.post('/api/plans/update', data).then(res => res.data)
  },
  delete (id) {
    return axios.delete('/api/plans/delete', {data: {id: id}}).then(res => res.data)
  }
}
