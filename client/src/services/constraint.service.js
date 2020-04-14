import axios from 'axios'

export default {
  getAll () {
    return axios.get('/api/constraints').then(res => res.data)
  },
  findById (id) {
    return axios.get('/api/constraints/' + id).then(res => res.data)
  },
  getAllConstraintSeats () {
    return axios.get('/api/constraintSeats').then(res => res.data)
  },
  getByConstraintAndPlan (constraintId, planId) {
    return axios.get('/api/constraintSeats/getByConstraintAndPlan/' + constraintId + '/' + planId).then(res => res.data)
  },
  getByPlan (planId) {
    return axios.get('/api/constraintSeats/getByPlan/' + planId).then(res => res.data)
  },
  create (data) {
    return axios.post('/api/constraints/create', data).then(res => res.data)
  },
  update (data) {
    return axios.post('/api/constraints/update', data).then(res => res.data)
  },
  delete (id) {
    return axios.delete('/api/constraints/delete', {data: {id: id}}).then(res => res.data)
  },
  fusion (data) {
    return axios.post('/api/constraints/fusion', data).then(res => res.data)
  },
  updateConstraintSeat (planId, constraintId, cseats) {
    var data = {
      planId: planId,
      constraintId: constraintId,
      seats: cseats
    }
    return axios.post('/api/constraints/updateConstraintSeat', data).then(res => res.data)
  },

  /**
   * Retourne toutes les contraintes qui n'ont aucun sièges sur aucun plans
   */
  getEmptyConstraints () {
    return new Promise((resolve, reject) => {
      let errorConstraints = []
      this.getAll().then(constraints => {
        this.getAllConstraintSeats().then(cSeats => {
          constraints.forEach(constraint => {
            let isConstraintSetOnce = cSeats.find(cs => cs.constraint_id === constraint.id)
            if (!isConstraintSetOnce) {
              errorConstraints.push(constraint)
            }
          })
          resolve(errorConstraints)
        })
      })
    })
  }
}
