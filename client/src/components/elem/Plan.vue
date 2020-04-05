<template>
  <div class='event-plan' v-if="seats">
    <table class="seats">
      <tr v-for="line in lineCount" :key="line">
        <Seat v-for="cell in cellCount" :key="line + '_' + cell" :seat="seats.find(s => s.line === (line - 1) && s.cell === (cell - 1))" @place-group="placeGroup" />
      </tr>
    </table>
  </div>
</template>

<script>
import Line from '@/components/elem/Line'
import Seat from '@/components/elem/Seat'

export default {
  name: 'Plan',
  components: {
    Line,
    Seat
  },
  props: {
    plan: Object
  },
  data () {
    return {
      seats: [],
      lineCount: 0,
      cellCount: 0
    }
  },
  created () {
    const it = this
    document.addEventListener('keyup', function (evt) {
      // SUPPR
      if (evt.keyCode === 46) {
        // on récupère les seats sélectionnés
        console.log('seats', it.seats)
        it.seats.filter(s => s.isSelected).forEach(s => it.emptySeat(s))
      }
    })
  },
  mounted () {
    if (this.plan) {
      this.lineCount = this.plan.height
      this.cellCount = this.plan.width
      for (var line = 0; line < this.lineCount; line++) {
        for (var cell = 0; cell < this.cellCount; cell++) {
          this.seats.push({
            group: null,
            isEmpty: true,
            line: line,
            cell: cell,
            isSelected: false,
            forbidden: false
          })
        }
      }
    }
  },
  methods: {
    placeGroup: function (data) {
      if (data.fromList) {
        // drop depuis la liste
        this.placeGroupFromList(data)
      } else if (data.fromSeat) {
        // on vide l'ancien siège
        this.emptySeat(data.prevSeat)
        // on bouge d'un siège à l'autre
        this.setSeat(data.seat, data.group)
      } else if (data.del) {
        // suppr le siège
        this.emptySeat(data.seat)
      }
    },

    findSeat: function (line, cell) {
      return this.seats.find(s => s.line === line && s.cell === cell)
    },

    emptySeat: function (seat) {
      // on MAJ l'ancien groupe si existant
      if (!seat.isEmpty && seat.group) {
        this.$emit('group-changed', { group: seat.group, count: -1 })
        seat.group = null
        seat.isEmpty = true
      }
    },
    setSeat: function (seat, newGroup) {
      // this.emptySeat(seat)
      // seat.group = {test: 'ok'}
      this.$set(seat, 'group', newGroup)
      // seat.isEmpty = newGroup === null // est vide si group null
      this.$emit('group-changed', { group: newGroup, count: 1 })
    },

    placeGroupFromList: function (data) {
      let count = 0
      let group = data.group
      let seat = this.seats.find(s => s.line === data.seat.line && s.cell === data.seat.cell)
      let remaining = 'remaining' in group ? group.remaining : group.number
      remaining = remaining < 0 ? 0 : remaining

      if (seat && remaining) {
        // on met direct le nom du groupe sur le siège
        this.setSeat(seat, group)
        count++
      }
      // let lineDirection = seat.line < (this.lineCount / 2) ? 1 : -1
      let cellDirection = seat.cell < (this.cellCount / 2) ? 1 : -1

      // let lastLine = lineDirection === 1 ? this.lineCount - 1 : 0
      let lastCell = cellDirection === 1 ? this.cellCount - 1 : 0

      let currentLine = seat.line
      let currentCell = seat.cell
      let currentSeat = this.findSeat(currentLine, currentCell)

      let stop = false
      do {
        currentCell += cellDirection
        currentSeat = this.findSeat(currentLine, currentCell)
        stop = (cellDirection === 1 && currentCell > lastCell) || (cellDirection === -1 && currentCell < lastCell) || currentSeat.isEmpty === false

        if (!stop && remaining) {
          this.setSeat(currentSeat, group)
          count++
        }
        // let changeLine = currentCell > lastCell || this.findSeat(currentLine, currentLine).isEmpty === false
        // if (changeLine) {
        //   // bout de la ligne, on prend la ligne suivante
        //   currentCell = cellDirection === 1 ? 0 : cellCount - 1
        //   currentLine += lineDirection
        // }
        // // on check si la cell de la ligne suivante est ok, sinon on continue
        // stop = currentLine > lastLine && currentCell > lastCell
      } while (count < remaining && stop === false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/seats.scss';
</style>
