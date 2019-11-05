<template>
  <div>
    <h2>Add a group</h2>
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
      <p><input type="button" value="Submit" @click="submit"></p>
      <p>{{ error }}</p>
    </form>
  </div>
</template>

<script>
import eventService from '../services/event.service'
import constraintService from '../services/constraint.service'
import groupService from '../services/group.service'

export default {
  components: {

  },
  data () {
    return {
      events: [],
      constraints: [],

      name: '',
      number: null,
      event: null,
      constraint: '',
      constraintNumber: 0,

      error: ''
    }
  },
  computed: {
  },
  mounted () {
    eventService.getAll().then((events) => {
      this.$set(this, 'events', events)
    })
    constraintService.getAll().then((constraints) => {
      this.$set(this, 'constraints', constraints)
    })
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
        constraint_name: this.constraint,
        constraint_number: this.constraintNumber
      }

      groupService.create(data).then(res => {
        if (res.error) {
          this.error = res.error
        } else {
          this.init()
        }
      })
    },

    verifyForm: function () {
      return true
    },

    init: function () {
      this.name = ''
      this.number = null
      this.event = null
      this.constraint = ''
      this.constraintNumber = 0
      this.error = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
