import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/forbiddenSeats').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/forbiddenSeats/' + id).then(res => res.data)
  },
  findByPlanId (planId) {
    return axios.get('/api/forbiddenSeatsByPlan/' + planId).then(res => res.data)
  }
}
