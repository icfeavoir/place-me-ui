<template>
  <div class='group-page-main'>
    <template v-if='group'>
      <form class="review-form" @submit.prevent="onSubmit">
        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
          <label for="number">Number:</label>
          <input type="number" id="number" v-model="number" />
        </p>
        <p>
          <label for="event">Event:</label>
          <select id="event" v-model.number="event">
            <option v-for="(item, key) in events" v-bind:key="key" :value="item.id">{{item.name}}</option>
          </select>
        </p>
        <p>
          <label for="plan">Plan:</label>
          <select id="plan" v-model.number="plan">
            <option v-for="(item, key) in plans" v-bind:key="key" :value="item.id">{{item.name}}</option>
          </select>
        </p>
        <p>
          <label for="constraint">Constraint:</label>
          <input type="constraint" id="constraint" v-model="constraint" list="constraintsNames" />
          <datalist id="constraintsNames">
            <option v-for="(constraint, key) in constraints" v-bind:key="key" :data-value="constraint.id" :value="constraint.name" />
          </datalist>
        </p>
        <p>
          <label for="constraint_number">Constraint Number:</label>
          <input type="number" id="constraintNumber" v-model="constraintNumber" />
        </p>
        <p><input type="button" value="Update" @click="update"></p>
        <p>{{ error }}</p>
    </form>
    </template>
  </div>
</template>

<script>
import groupService from '../services/group.service'
import eventService from '../services/event.service'
import planService from '../services/plan.service'
import constraintService from '../services/constraint.service'

export default {
  components: {

  },
  data () {
    return {
      groupId: this.$route.params.groupId,

      group: null,
      events: [],
      plans: [],
      constraints: [],

      name: null,
      number: null,
      event: null,
      plan: null,
      constraintId: null,
      constraint: null,
      constraintNumber: null
    }
  },
  created () {
  },
  mounted () {
    const it = this
    groupService.findById(this.groupId).then(group => {
      it.group = group
    })
    eventService.getAll().then((events) => {
      it.events = events
    })
    planService.getAll().then((plans) => {
      it.plans = plans
    })
    constraintService.getAll().then((constraints) => {
      it.constraints = constraints
    })
  },
  watch: {
    group: function (group) {
      this.name = group.name
      this.number = group.number
      this.event = group.event_id
      this.plan = group.plan_id
      this.constraintId = group.constraint_id
      this.constraintNumber = group.constraint_number
    },
    constraints: function (constraints) {
      var selectedConstraint = constraints.find(c => c.id === this.constraintId)
      if (selectedConstraint) {
        this.constraint = selectedConstraint.name || ''
      }
    }
  },
  methods: {
    update: function () {
      if (!this.verifyForm()) {
        console.log('error')
        return
      }

      var data = {
        id: this.groupId,
        name: this.name,
        number: this.number,
        event_id: this.event,
        plan_id: this.plan,
        constraint_name: this.constraint,
        constraint_number: this.constraintNumber
      }

      groupService.update(data).then(res => {
        console.log('UPDATED')
      })
    },

    verifyForm: function () {
      return true
    }
  }
}
</script>

<style>
.group-firstName .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  display: inline-block;
  min-width: 600px;
}
.add-new-list .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  margin: 0;
}
</style>
