<template>
  <div class='plan-page-main'>
    <template v-if='plan'>
      <div class='plan-name'>
        <h2>{{ plan.name }}<br>{{ plan.width }} x {{ plan.height }}</h2>
        <v-stage
          ref="stage"
          :config="configKonva"
        >
          <v-layer ref="layer">
            <template v-for="line in seats">
              <v-circle
                v-for="cell in line"
                :key="cell.id"
                :config="{
                  id: cell.id,
                  x: cell.x,
                  y: cell.y,
                  radius: 10,
                  fill: cell.forbidden ? 'black' : '#6363ff',
                  stroke: 'black',
                  strokeWidth: 1
                }"
              ></v-circle>
            </template>
          </v-layer>
        </v-stage>
      </div>
    </template>
  </div>
</template>

<script>
import planService from '../services/plan.service'
import forbiddenSeatService from '../services/forbiddenSeat.service'

export default {
  components: {

  },
  data () {
    return {
      planId: this.$route.params.planId,

      plan: null,
      seats: [],
      forbiddenSeats: [],

      configKonva: {
        width: 10000,
        height: 300
      }
    }
  },
  created () {
  },
  mounted () {
    forbiddenSeatService.findByPlanId(this.planId).then(forbiddenSeats => {
      this.forbiddenSeats = forbiddenSeats

      planService.findById(this.planId).then(plan => {
        this.plan = plan
        var count = 0
        for (var i = 0; i < plan.width; i++) {
          this.seats.push([])
          for (var j = 0; j < plan.height; j++) {
            this.seats[i].push({
              id: count,
              x: 20 + i * 30,
              y: 20 + j * 30,
              forbidden: forbiddenSeats.find(seat => seat.line === i && seat.cell === j) !== undefined
            })
            count++
          }
        }
      })
    })
  },
  methods: {
  }
}
</script>

<style>
.plan-firstName .is-editing {
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
