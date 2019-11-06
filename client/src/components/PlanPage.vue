<template>
  <div class='plan-page-main'>
    <template v-if='plan'>
      <div class='plan-name'>
        <h2>{{ plan.name }}<br>{{ plan.width }} x {{ plan.height }}</h2>
        <button @click="forbid">Forbid</button>
        <button @click="allow">Allow</button>
        <button @click="save">Save</button>
        <v-stage
          ref="stage"
          :config="configKonva"
        >
          <v-layer ref="layer">
              <v-rect :config="{
                x:0,
                y:0,
                width: 5000,
                height: 5000,
                fill: '#ccc',
              }"></v-rect>
            <v-circle
              v-for="seat in seats"
              :key="seat.id"
              @click="seatClicked(seat.id)"
              :config="{
                id: seat.id,
                x: seat.x,
                y: seat.y,
                radius: seatSize,
                fill: seat.forbidden ? 'red' : '#6363ff',
                stroke: 'black',
                strokeWidth: selected.includes(seat.id) ? 4 : 1
              }"
            ></v-circle>
          </v-layer>
        </v-stage>
      </div>
    </template>
  </div>
</template>

<script>
import planService from '../services/plan.service'
import forbiddenSeatService from '../services/forbiddenSeat.service'

const SEAT_SIZE = 10

export default {
  components: {

  },
  data () {
    return {
      planId: this.$route.params.planId,

      plan: null,
      seatSize: SEAT_SIZE,
      seats: [],
      forbiddenSeats: [],
      selected: []
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
        for (var line = 0; line < plan.height; line++) {
          for (var cell = 0; cell < plan.width; cell++) {
            this.seats.push({
              id: count,
              x: 20 + cell * 30,
              y: 20 + line * 30,
              line: line,
              cell: cell,
              forbidden: forbiddenSeats.find(seat => seat.line === line && seat.cell === cell) !== undefined
            })
            count++
          }
        }
      })
    })
  },
  computed: {
    configKonva: function () {
      return {
        width: this.plan.width * 30 + 10,
        height: this.plan.height * 30 + 10
      }
    }
  },
  methods: {
    seatClicked: function (seatId) {
      if (this.selected.includes(seatId)) {
        this.selected = this.selected.filter((id, i, arr) => { return id !== seatId })
      } else {
        this.selected.push(seatId)
      }
    },

    forbid: function () {
      for (var i in this.selected) {
        var seat = this.seats.find(s => s.id === this.selected[i])
        if (seat) {
          seat.forbidden = true
        }
      }
      this.selected = []
    },
    allow: function () {
      for (var i in this.selected) {
        var seat = this.seats.find(s => s.id === this.selected[i])
        if (seat) {
          seat.forbidden = false
        }
      }
      this.selected = []
    },

    save: function () {
      var fseats = this.seats.filter((seat, i, arr) => { return seat.forbidden })
      forbiddenSeatService.update(this.planId, fseats).then(res => {
        if (res) {
          console.log('UPDATED')
        }
      })
    }
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
