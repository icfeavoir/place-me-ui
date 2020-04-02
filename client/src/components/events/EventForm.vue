<template>
  <div class="form" @keydown.esc="init">
    <h2 class="form-title">{{ this.group ? name : 'Nouveau groupe'}}</h2>
     <form class="group-form" @keydown.enter="submit">
        <input v-focus id="name" @change="upperFirst" v-model="name" placeholder="Nom de la réservation">
        <input id="number" type="number" v-model="number" placeholder="Nombre" />
        <select id="event" v-model.number="event">
          <option v-for="(item, key) in events" v-bind:key="key" :value="item.id">{{item.name}}</option>
        </select>
        <select id="plan" v-model.number="plan">
          <option v-for="(item, key) in plans" v-bind:key="key" :value="item.id">{{item.name}}</option>
        </select>

        <div class="constraint-container">
          <button type="button" @click.prevent="showConstraint = true" v-if="!showConstraint"><i class="fa fa-plus"></i> Ajouter une contrainte</button>
          <transition name="fade">
            <div class="constraint" v-if="showConstraint">
              <hr>
              <p>Contrainte</p>
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
      <input type="button" :value="group ? 'Modifier la réservation' : 'Enregistrer'" @click="submit">
      <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
    </form>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import constraintService from '@/services/constraint.service'
import groupService from '@/services/group.service'
import planService from '@/services/plan.service'

import Checkbox from '@/components/elem/Checkbox'

export default {
  name: 'GroupForm',
  components: {
    Checkbox
  },
  props: {
    group: Object
  },
  data () {
    return {
      events: [],
      plans: [],
      constraints: [],

      name: '',
      number: null,
      event: null,
      plan: null,
      constraint: '',
      constraintNumber: null,

      showConstraint: false,
      constraintForAll: true,
      error: ''
    }
  },
  computed: {
  },
  mounted () {
    const it = this
    eventService.getAll().then((events) => {
      it.events = events
      it.event = events.length ? events[0].id : null
    })
    planService.getAll().then((plans) => {
      it.plans = plans
      it.plan = plans.length ? plans[0].id : null
    })
    constraintService.getAll().then((constraints) => {
      it.constraints = constraints
    })
  },
  watch: {
    group: function (newGroup, oldGroup) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      if (!this.verifyForm()) {
        console.log('error')
        return
      }

      var data = {
        name: this.name,
        number: this.number,
        event_id: this.event,
        plan_id: this.plan,
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
          }
        })
      }
    },

    verifyForm: function () {
      return true
    },

    init: function () {
      let group = this.group || {}

      this.name = group.name || ''
      this.number = group.number || null
      this.event = group.event_id || (this.events.length ? this.events[0].id : null)
      this.plan = group.plan_id || (this.plans.length ? this.plans[0].id : null)
      this.constraint = group.constraintText || ''
      this.constraintNumber = group.constraint_number || 0
      if (this.constraint) {
        this.showConstraint = true
        this.constraintForAll = this.constraintNumber === this.number
      } else {
        this.showConstraint = false
        this.constraintForAll = true
      }
      this.error = ''
    },

    upperFirst: function () {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1)
    },

    change: function (d) {
      console.log(d)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
<style lang="scss" scoped>
  @import '@/scss/group-form.scss';
</style>
<style lang="scss">
  // on veut toucher aux composants enfants (checkbox ici)
  .checkmark {
    top: 10px !important;
  }
</style>
