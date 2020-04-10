import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/groupSeats').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/groupSeats/' + id).then(res => res.data)
  },
  getByEventPlanId (eventPlanId) {
    return axios.post('/api/groupSeats/getByEventPlanId', {eventPlanId: eventPlanId}).then(res => res.data)
  },
  getByEventPlanIdAndGroupId (eventPlanId, groupId) {
    return axios.post('/api/groupSeats/getByEventPlanIdAndGroupId', {eventPlanId: eventPlanId, groupId: groupId}).then(res => res.data)
  },
  setGroupSeat (data) {
    return axios.post('/api/groupSeats/setGroupSeat', data).then(res => res.data)
  }
}
