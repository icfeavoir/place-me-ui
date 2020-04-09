import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/eventPlans').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/eventPlans/' + id).then(res => res.data)
  },
  getByEventId (id) {
    return axios.get('/api/eventPlansByEventId/' + id).then(res => res.data)
  }
}
