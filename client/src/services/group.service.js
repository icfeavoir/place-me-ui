import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groups').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groups/' + id).then(res => res.data)
  },
  getByEventPlanId (eventPlanId) {
    return axios.post('/api/groups/getByEventPlanId', {eventPlanId: eventPlanId}).then(res => res.data)
  },
  countGroupByEvent () {
    return axios.get('/api/countGroupByEvent').then(res => res.data)
  },
  create (data) {
    return axios.post('/api/groups/create', data).then(res => res.data)
  },
  update (data) {
    return axios.post('/api/groups/update', data).then(res => res.data)
  },
  delete (id) {
    return axios.delete('/api/groups/delete', {data: {id: id}}).then(res => res.data)
  }
}
