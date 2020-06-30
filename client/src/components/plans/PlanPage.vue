<template>
  <div class="plan-page-main">
    <ConstraintList
      ref="constraintList"
      class="constraint-list"
      :constraints="constraints"
      @constraint-clicked="onConstraintClicked"
    />
    <div class="plan-container" v-if="plan">
      <div class="plan-controls">
        <div class="info-text">
          <p v-if="$refs.plan" class="plan-infos">{{ plan.name }} : {{ plan.width * plan.height - (forbiddenSeats.length) }} places</p>
          <p>Cliquez sur une des contraintes à gauche, puis sur les sièges concernés par cette contrainte, avant de sauvegarder.</p>
        </div>
        <SaverInfo :isSaved="isSaved" :isSaving="isSaving" :auto="false" @click="save"/>
        <PrettyButton @click="init" icon="undo-alt">Annuler</PrettyButton>
      </div>

      <Plan
        ref="plan"
        class="plan"
        :plan="plan"
        :isSelectable="planSelectable"
        :isDraggable="false"
        :multipleSelect="false"
        :keyListenning="false"
        @select-seat="onSeatClick"
      />
    </div>
  </div>
</template>

<script>
import planService from '@/services/plan.service'
import forbiddenSeatService from '@/services/forbiddenSeat.service'
import constraintService from '@/services/constraint.service'

import Plan from '@/components/elem/Plan'
import SaverInfo from '@/components/elem/SaverInfo'
import PrettyButton from '@/components/elem/PrettyButton'
import ConstraintList from '@/components/constraints/ConstraintList'

export default {
  name: 'PlanPage',
  components: {
    Plan,
    SaverInfo,
    PrettyButton,
    ConstraintList
  },
  data () {
    return {
      planId: this.$route.params.planId,
      plan: null,
      constraints: [],
      planSelectable: false,
      isSaved: true,
      isSaving: false
    }
  },
  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('keyup', this.keyup)
  },
  mounted () {
    // LE PLAN
    planService.findById(this.planId).then(plan => {
      plan.forbiddenSeats = []
      this.$set(this, 'plan', plan)
      // puis on init
      this.init()
    })
  },
  methods: {
    init () {
      this.isSaved = true
      this.constraints = []
      // on enlève tous les sièges
      if (this.$refs.plan) {
        this.$refs.plan.unselectAll()
        this.$refs.plan.getAllSeats().forEach(seat => {
          this.removeConstraintToPlan(seat)
        })
      }
      // FORBID
      this.planSelectable = false
      forbiddenSeatService.findByPlanId(this.planId).then(forbiddenSeats => {
        // on ajoute comme une contrainte
        let forbiddenConstraint = {
          id: 0,
          name: 'Interdit',
          seats: forbiddenSeats,
          color: this.colors.mainRed,
          remaining: 1,
          isVisible: true,
          isSelected: false
        }
        this.constraints.push(forbiddenConstraint)
        // on ajoute direct sur le plan
        forbiddenSeats.forEach(forbidden => {
          // on prend tous les sièges
          let seat = this.$refs.plan.findSeat(forbidden.line, forbidden.cell)
          this.addConstraintToPlan(forbiddenConstraint, seat, true)
        })
      })

      // LES CONTRAINTES
      constraintService.getAll().then((constraints) => {
        constraints.forEach(constraint => {
          // on récupère les seats
          constraintService.getByConstraintAndPlan(constraint.id, this.planId).then(constraintSeats => {
            let constraintToAdd = {
              id: constraint.id,
              name: constraint.name,
              seats: constraintSeats,
              color: this.colors.mainGreen,
              remaining: 1,
              isVisible: true,
              isSelected: false
            }
            this.constraints.push(constraintToAdd)
          })
        })
      })
    },

    addConstraintToPlan (constraint, seat, auto = false) {
      let accepted = false
      if (constraint && seat) {
        // si le siege est déjà pris par FORBID, on met pas
        if (!seat.isEmpty && seat.group.id === 0) {
          if (!auto) {
            // on indique pourquoi on peut pas
            this.$toasted.error('Cette place est interdite. Veuillez enlever l\'interdiction avant de mettre la contrainte.', {icon: 'ban'})
            seat.isSelected = false
          }
        } else {
          this.$refs.plan.placeGroup({
            setSeat: true, // mode simple
            seat: seat,
            group: constraint
          })
          accepted = true
        }
      }
      return accepted
    },
    removeConstraintToPlan (seat, force = false) {
      if (seat) {
        // si le siege est déjà pris par FORBID, on met pas
        if (force || (!seat.isEmpty && seat.group.id !== 0)) {
          this.$refs.plan.placeGroup({
            del: true, // mode suppr
            seat: seat
          })
        }
      }
    },

    onConstraintClicked (constraint, selected) {
      this.planSelectable = selected
      // d'abord on enlève tous les sièges (sauf FORBID)
      this.$refs.plan.getAllSeats().forEach(seat => {
        this.removeConstraintToPlan(seat)
      })

      // puis on affiche sur le plan les sièges concernés (SAUF POUR FORBID car déjà présent)
      if (selected && constraint && constraint.id > 0) {
        let constraintSeats = constraint.seats || []
        // on ajoute direct sur le plan
        constraintSeats.forEach(constraintSeat => {
          // on prend tous les sièges
          let seat = this.$refs.plan.findSeat(constraintSeat.line, constraintSeat.cell)
          if (seat) {
            this.addConstraintToPlan(constraint, seat, true)
          }
        })
      }

      // puis on sélectionne / déselectionne tous les sièges concernés
      this.$refs.plan.getAllSeats().forEach(seat => {
        // selected : Boolean indiquant sélection ou non
        if (selected && constraint && seat.group && 'id' in seat.group && seat.group.id === constraint.id) {
          seat.isSelected = true
        } else {
          seat.isSelected = false
        }
      })
    },

    onSeatClick (seat) {
      if (seat === null) {
        // mode non selectable
        this.$toasted.error('Aucune contrainte sélectionnée', {icon: 'ban'})
        return
      }

      // Permet d'ajouter / supprimer une contrainte à un siège
      let selectedConstraint = this.$refs.constraintList.getSelectedConstraint()
      if (selectedConstraint) {
        // on récupère si le seat est déjà avec cette constraint
        if (seat.group && seat.group.id === selectedConstraint.id) {
          // on veut l'enlever
          this.removeConstraintToPlan(seat, true) // on force
          // on l'enlève aux constraintSeats
          selectedConstraint.seats = selectedConstraint.seats.filter(s => !(s.line === seat.line && s.cell === seat.cell))
          this.isSaved = false
        } else {
          // on veut l'ajouter
          let accepted = this.addConstraintToPlan(selectedConstraint, seat, false)
          if (accepted) {
            // on l'ajoute aux constraintSeats
            selectedConstraint.seats.push({
              line: seat.line,
              cell: seat.cell
            })
            this.isSaved = false
            // si la contrainte ajoutée est FORBID, il faut retirer ce seat de toutes les autres contraintes
            if (selectedConstraint.id === 0) {
              this.constraints.filter(c => c.id > 0).forEach(constraint => {
                constraint.seats = constraint.seats.filter(s => !(s.line === seat.line && s.cell === seat.cell))
              })
            }
          }
        }
      }
    },

    save: function () {
      this.isSaving = true
      let forbiddenSeats = []
      // on récupère depuis le plan car il est important que le nombre de F Seats soit exact (moins grave pour constraints)
      this.forbiddenSeats.forEach(seat => {
        forbiddenSeats.push({
          plan_id: this.planId,
          line: seat.line,
          cell: seat.cell
        })
      })
      let requests = [forbiddenSeatService.update(this.planId, forbiddenSeats)]

      this.constraints.filter(c => c.id > 0).forEach(constraint => {
        requests.push(constraintService.updateConstraintSeat(this.planId, constraint.id, constraint.seats))
      })

      Promise.all(requests).then(data => {
        this.$toasted.success('Enregistré !')
        this.isSaved = true
      }).catch(e => {
        this.$toasted.error('Erreur !', {icon: 'ban'})
        console.error(e)
      }).finally(() => {
        this.isSaving = false
      })
    }
  },
  computed: {
    forbiddenSeats () {
      return this.$refs.plan ? this.$refs.plan.getGroupSeats(0) : []
    }
  },

  beforeRouteLeave (to, from, next) {
    if (!this.isSaved) {
      this.$toasted.error('Vous n\'avez pas enregistré', {icon: 'ban', duration: 1000})
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/scss/plan-page.scss';
</style>
