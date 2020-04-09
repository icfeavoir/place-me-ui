import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groupSeats').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groupSeats/' + id).then(res => res.data)
  },
  getByEventPlanId (eventPlanId) {
    return axios.post('/api/groupSeats/getByEventPlanId', {event_plan_id: eventPlanId}).then(res => res.data)
  },
  setGroupSeat (data) {
    return axios.post('/api/groupSeats/setGroupSeat', data).then(res => res.data)
  }
}
