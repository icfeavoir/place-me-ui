<template>
  <div class='event-plan'>
    <table class="seats">
      <tr v-for="line in seats" :key="line._id">
        <Seat v-for="seat in line" :key="seat._id" :seat=seat>{{ seat.text }}</Seat>
      </tr>
    </table>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'

import Line from '@/components/elem/Line'
import Seat from '@/components/elem/Seat'

export default {
  components: {
    Line,
    Seat
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
    eventService.findById(this.$route.params.eventId).then(event => {
      this.$set(this, event, event)
    })
    planService.getAll().then(plans => {
      let plan = plans[0]
      this.$set(this, plans, plan)

      for (var line = 0; line < plan.height; line++) {
        this.seats.push([])
        for (var cell = 0; cell < plan.width; cell++) {
          this.seats[line].push({
            text: line + '.' + cell,
            line: line,
            cell: cell,
            selected: false,
            forbidden: false
          })
        }
      }
      console.log(this.seats)
    })
  },
  methods: {
    generate: function (e, planId = null) {
      eventService.generate({
        eventId: this.event.id,
        planId: planId
      }).then(data => console.log(data))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/seats.scss';
</style>
