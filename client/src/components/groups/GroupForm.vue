<template>
  <div class="form" @keydown.esc="init">
    <h2 class="form-title">{{ group ? name : 'Nouveau groupe'}}</h2>
    <form class="add-form" @keydown.enter="submit">
      <input v-focus id="name" @change="upperFirst" v-model="name" placeholder="Nom de la réservation">
      <input id="number" type="number" v-model="number" placeholder="Nombre" />
      <select id="event" v-model.number="event">
        <option v-for="(item, key) in events" v-bind:key="key" :value="item.id">{{item.name}}</option>
      </select>
      <select id="plan" v-model.number="plan">
        <option v-for="(item, key) in plans" v-bind:key="key" :value="item.id">{{item.name}}</option>
      </select>
      <div class="color-container" v-if="group">
        <label>Couleur</label>
        <input id="color" type="color" name="color" v-model="color"/>
      </div>

      <div class="constraint-container">
        <button type="button" @click.prevent="showConstraint = true" v-if="!showConstraint"><i class="fa fa-plus"></i> Ajouter une contrainte</button>
        <transition name="fade">
          <div class="constraint" v-if="showConstraint">
            <hr>
            <button type="button" @click.prevent="removeConstraint" v-if="showConstraint"><i class="fa fa-minus-circle"></i> Supprimer la contrainte</button>
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
        <input type="button" :value="group ? 'Modifier la réservation' : 'Enregistrer'" @click="submit">
        <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
      </div>
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
  computed: {
  },
  mounted () {
    let allRequests = [
      eventService.getAll(),
      planService.getAll(),
      constraintService.getAll()
    ]

    Promise.all(allRequests).then(data => {
      let events = data[0]
      this.events = events
      this.event = events.length ? events[0].id : null

      let plans = data[1]
      this.plans = plans
      this.plan = plans.length ? plans[0].id : null

      let constraints = data[2]
      this.constraints = constraints

      // quand tout est prêt, on init
      if (this.group) {
        // le group est déjà prêt, watch ne sera pas appelé
        this.init()
      }
    })
  },
  watch: {
    group: function (newGroup, oldGroup) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      var data = {
        name: this.name,
        number: this.number,
        color: this.color,
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
          }
        })
      }
    },

    init: function () {
      let group = this.group || {}

      this.name = group.name || ''
      this.number = group.number || null
      this.color = group.color || '#000000'
      this.event = group.event_id || (this.events.length ? this.events[0].id : null)
      this.plan = group.plan_id || (this.plans.length ? this.plans[0].id : null)
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
