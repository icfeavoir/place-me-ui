<template>
  <div class="form" @keydown.esc="init">
    <h2 class="form-title">{{ group ? name : 'Nouveau groupe'}}</h2>
    <form class="add-form" @keydown.enter.prevent="submit">
      <input v-focus ref="name" id="name" @change="upperFirst" v-model="name" placeholder="Nom de la réservation">
      <input id="number" type="number" v-model="number" placeholder="Nombre" />
      <select v-if="!selectedEvent" id="event" v-model.number="event">
        <option v-for="(item, key) in events" v-bind:key="key" :value="item.id">{{item.name}}</option>
      </select>
      <select v-if="!selectedPlan" id="plan" v-model.number="plan">
        <option v-for="(item, key) in plans" v-bind:key="key" :value="item.id">{{item.name}}</option>
      </select>
      <div class="color-container" v-if="group">
        <label>Couleur</label>
        <input id="color" type="color" name="color" v-model="color"/>
      </div>

      <div class="constraint-container">
        <PrettyButton :allowSmall="false" class="square small-btn center margin" @click="showConstraint = true" v-if="!showConstraint" icon="plus">Ajouter une contrainte</PrettyButton>
        <transition name="fade">
          <div class="constraint" v-if="showConstraint">
            <hr>
            <PrettyButton :allowSmall="false" class="square small-btn center margin" @click="removeConstraint" v-if="showConstraint" icon="minus-circle">Supprimer la contrainte</PrettyButton>
            <p>Choississez une contrainte de la liste, ou entrez-en une nouvelle pour l'enregistrer</p>
            <input type="constraint" id="constraint" v-model="constraint" list="constraintsNames" placeholder="Taper la contrainte" />
            <datalist id="constraintsNames">
              <option v-for="(constraint, key) in constraints" v-bind:key="key" :data-value="constraint.id" :value="constraint.name" />
            </datalist>
            <div class="check-constraint">
              <Checkbox :checked.sync="constraintForAll" class="checkbox" :text-revert=true>Pour tout<br>le groupe</Checkbox>
              <input v-if="!constraintForAll" min="1" type="number" id="constraint-number" v-model="constraintNumber" placeholder="Nombre" />
            </div>
          </div>
        </transition>
      </div>

      <div class="submit-container">
        <PrettyButton :allowSmall="false" class="square more-padding center margin" @click="submit" >{{ group ? 'Modifier la réservation' : 'Enregistrer' }}</PrettyButton>
        <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
      </div>
    </form>
  </div>
</template>

<script>
import constraintService from '@/services/constraint.service'
import groupService from '@/services/group.service'
import eventPlanService from '@/services/eventPlan.service'

import Checkbox from '@/components/elem/Checkbox'
import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'GroupForm',
  components: {
    Checkbox,
    PrettyButton
  },
  props: {
    group: Object,
    selectedEvent: {
      type: Number,
      default: null
    },
    selectedPlan: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      eventPlans: [],
      events: [],
      plans: [],
      constraints: [],

      name: '',
      number: null,
      color: '#000000',
      event: null,
      plan: null,
      constraint: '',
      constraintNumber: null,

      showConstraint: false,
      constraintForAll: true,
      error: ''
    }
  },
  mounted () {
    let allRequests = [
      eventPlanService.getAll(),
      constraintService.getAll()
    ]

    Promise.all(allRequests).then(data => {
      this.eventPlans = data[0]

      this.events = []
      this.eventPlans.map(ep => ep.event).forEach(event => {
        if (this.events.find(e => e.id === event.id) === undefined) {
          this.events.push(event)
        }
      })
      this.events.sort((a, b) => { return a.date < b.date ? -1 : 1 }) // par date

      let constraints = data[1]
      this.constraints = constraints

      this.init()
    })
  },
  methods: {
    submit: function () {
      var data = {
        name: this.name,
        number: this.number,
        color: this.color,
        event_plan_id: this.eventPlanId,
        constraint_name: this.constraint,
        constraint_number: this.constraintForAll ? this.number : this.constraintNumber
      }

      if (this.group) {
        // UPDATE
        data.id = this.group.id
        groupService.update(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Modifié !')
            // on émet le groupe modifié
            this.$emit('data-changed', res)
          }
        })
      } else {
        // NEW
        groupService.create(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Enregistré !')
            this.init()
            // on émet le groupe créé
            this.$emit('data-changed', res)
          }
        })
      }
    },

    init: function () {
      let group = this.group || {}
      this.name = group.name || ''
      this.number = group.number || null
      this.color = group.color || '#000000'
      // event & plan
      if (group && group.eventPlan) {
        this.event = group.eventPlan.event.id
        this.plan = group.eventPlan.plan.id
      } else if (this.selectedEvent && this.selectedPlan) {
        this.event = this.selectedEvent
        this.plan = this.selectedPlan
      } else {
        this.event = this.event || (this.events.length ? this.events[0].id : null)
        this.plan = this.plan || (this.plans.length ? this.plans[0].id : null)
      }
      this.constraint = group.constraintText || (group.constraint && group.constraint.name) || ''
      this.constraintNumber = group.constraint_number || 0
      if (this.constraint) {
        this.showConstraint = true
        this.constraintForAll = this.constraintNumber === this.number
      } else {
        this.showConstraint = false
        this.constraintForAll = true
      }
      this.error = ''
      this.$refs.name.focus()
    },
    removeConstraint () {
      this.showConstraint = false
      this.constraint = ''
      this.constraintNumber = this.number
      this.constraintForAll = true
    },
    upperFirst: function () {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1)
    }
  },
  computed: {
    eventPlanId () {
      let selectedEP = this.eventPlans.find(ep => ep.event.id === this.event && ep.plan.id === this.plan)
      return selectedEP ? selectedEP.id : null
    }
  },
  watch: {
    group: function (newGroup, oldGroup) {
      this.init()
    },
    event () {
      // quand on select un event, on met à jour la liste des plans
      this.plans = []
      this.eventPlans.filter(ep => ep.event.id === this.event).map(ep => ep.plan).forEach(plan => {
        if (this.plans.find(p => p.id === plan.id) === undefined) {
          this.plans.push(plan)
        }
      })
      this.plans.sort((a, b) => { return a.name < b.name ? -1 : 1 }) // par nom
    },
    plans () {
      // quand la liste des plans est regénérée, on regarde si le plan select est null et dans ce cas on en met un par défaut
      if (!this.plan) {
        this.plan = this.plans.length ? this.plans[0].id : null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
<style lang="scss" scoped>
  @import '@/scss/add-form.scss';
</style>
<style lang="scss" scoped>
  /deep/ .checkmark {
    top: 10px !important;
  }
</style>
