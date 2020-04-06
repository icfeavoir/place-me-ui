import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groupSeats').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groupSeats/' + id).then(res => res.data)
  },
  getByEventPlan (eventId, planId) {
    // return axios.post('/api/groups/getByEventPlan', {eventId: eventId, planId: planId}).then(res => res.data)
    return axios.post('/api/groupSeats/getByEventPlan', {event_id: eventId, plan_id: planId}).then(res => res.data)
  },
  setGroupSeat (data) {
    return axios.post('/api/groupSeats/setGroupSeat', data).then(res => res.data)
  }
}
