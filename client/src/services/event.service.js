import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/events').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/events/' + id).then(res => res.data)
  },
  getPlans (id) {
    return axios.get('/api/eventPlans/' + id).then(res => res.data)
  },
  getNoPlans (id) {
    return axios.get('/api/eventNoPlans/' + id).then(res => res.data)
  },
  addPlan (eventId, planId) {
    return axios.post('/api/events/addPlan', {eventId: eventId, planId: planId}).then(res => res.data)
  },
  deletePlan (eventId, planId) {
    return axios.post('/api/events/deletePlan', {eventId: eventId, planId: planId}).then(res => res.data)
  },
  generate (data) {
    return axios.post('/api/events/generate', data).then(res => res.data)
  },
  create (data) {
    return axios.post('/api/events/create', data).then(res => res.data)
  },
  update (data) {
    return axios.post('/api/events/update', data).then(res => res.data)
  },
  delete (id) {
    return axios.delete('/api/events/delete', {data: {id: id}}).then(res => res.data)
  }
}
