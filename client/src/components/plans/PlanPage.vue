<template>
  <div class="plan-page-main">
    <ConstraintList class="constraint-list" v-if="constraints" :constraints="constraints" />
    <div class="plan-container" v-if="plan">
      <div class="plan-controls">
        <div>
          <p class="plan-infos">{{ plan.name }} : {{ plan.width * plan.height - (forbidden ? forbidden.length : 0) }} places</p>
          <p>Cliquez sur une des contraintes à gauche, puis sur les sièges concernés par cette contrainte, avant de sauvegarder.</p>
        </div>
        <button class="main-btn" @click="save"><i class="fa fa-save"></i>Enregistrer</button>
      </div>

      <Plan class="plan" :plan="plan" />
    </div>
  </div>
</template>

<script>
import planService from '@/services/plan.service'
import forbiddenSeatService from '@/services/forbiddenSeat.service'
import constraintService from '@/services/constraint.service'

import Plan from '@/components/elem/Plan'
import ConstraintList from '@/components/constraints/ConstraintList'

export default {
  name: 'PlanPage',
  components: {
    Plan,
    ConstraintList
  },
  data () {
    return {
      planId: this.$route.params.planId,
      plan: null,
      constraints: null,
      forbidden: null
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
    planService.findById(this.planId).then(plan => {
      plan.forbiddenSeats = []
      this.$set(this, 'plan', plan)
      forbiddenSeatService.findByPlanId(plan.id).then(forbiddenSeats => {
        this.$set(this, 'forbidden', forbiddenSeats || [])
      })
    })
    constraintService.getAll().then((constraints) => {
      this.$set(this, 'constraints', constraints)
    })
  },
  methods: {
    // TODO: interdire la sélection du plan + gérer les seats quand on choisit une contrainte
    onConstraintClicked (id) {
      if (id === 0) {
      }
    },

    save: function () {
      var fseats = this.seats.filter((seat, i, arr) => { return seat.forbidden })
      forbiddenSeatService.update(this.planId, fseats).then(res => {
        if (res) {
          this.$toasted.success('Enregistré !')
        }
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  @import '@/scss/plan-page.scss';
</style>
