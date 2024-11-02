
<template>
  <div class='event-page-main'>
    <template v-if='event'>
      <div class='event-firstName'>
        <h2>{{ event.name }}</h2>
        <br>
        <p><button @click="generate">GENERATE ALL</button></p>
        <br>
        <div v-for='plan in plans' class='plan' :key='plan._id'>
          {{ plan.name }}
          <p><button @click="generate(this, plan.id)">GENERATE</button></p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'

export default {
  components: {
  },
  data () {
    return {
      event: null,
      plans: [],
      seats: []
    }
  },
  created () {
  },
  mounted () {
    eventService.findById(this.$route.params.eventId).then(e => {
      this.$set(this, 'event', e)
    })
    planService.getAll().then(plans => {
      this.$set(this, 'plans', plans)
    })
  },
  methods: {
    generate: function (e, planId = null) {
      eventService.generate({
        eventId: this.event.id,
        planId: planId
      }).then(data => console.info(data))
    }
  }
}
</script>

<style>
.event-firstName {
  background-color: #ffffff;
}
.event-firstName .is-editing {
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

.plan {
  border-radius: 3px;
  color: #FFFFFF;
  display: inline-block;
  text-decoration: none;
  width: 15%;
  min-width: 150px;
  min-height: 80px;
  padding: 10px;
  background-color: rgb(0, 121, 191);
  margin: 0 15px 15px 0;
}
</style>
