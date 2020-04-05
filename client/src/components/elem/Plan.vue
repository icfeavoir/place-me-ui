<template>
  <div class='event-plan' v-if="seats">
    <table class="seats">
      <tr v-for="line in lineCount" :key="line">
        <Seat v-for="cell in cellCount" :key="line + '_' + cell"
          :seat="seats.find(s => s.line === (line - 1) && s.cell === (cell - 1))"
          @place-group="placeGroup"
          @seat-click="seatClick"
        />
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
      cellCount: 0,
      // select with shift
      isShiftPressed: false,
      firstSelectedSeat: null,
      specialSelect: false
    }
  },
  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
  },
  mounted () {
    if (this.plan) {
      this.lineCount = this.plan.height
      this.cellCount = this.plan.width
      for (var line = 0; line < this.lineCount; line++) {
        for (var cell = 0; cell < this.cellCount; cell++) {
          let isForbidden = this.plan.forbiddenSeats.filter(fs => fs.line === line && fs.cell === cell).length > 0
          this.seats.push({
            group: null,
            isEmpty: true,
            isForbidden: isForbidden,
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
      if (data.auto) {
        // essaie de placer les gens en auto
        this.placeGroupAuto(data)
      } else if (data.setSeat) {
        // mode simple : group vers seat
        this.setSeat(data.seat, data.group)
      } else if (data.fromAnotherSeat) {
        // on vide l'ancien siège
        this.emptySeat(data.prevSeat)
        // on assigne
        this.setSeat(data.seat, data.group)
      } else if (data.del) {
        // suppr le siège
        this.emptySeat(data.seat)
      }
    },

    findSeat: function (line, cell) {
      return this.seats.find(s => s.line === line && s.cell === cell)
    },
    getSelectedSeats () {
      return this.seats.filter(s => s.isSelected)
    },
    selectSeat (seat, cell = null) {
      if (cell !== null) {
        // line, cell
        seat = this.findSeat(seat, cell)
      }
      if (seat) {
        seat.isSelected = true
      }
    },
    selectAll () {
      this.specialSelect = true
      this.seats.forEach(s => this.selectSeat(s))
    },
    unselectAll () {
      this.firstSelectedSeat = null
      this.getSelectedSeats().forEach(s => { s.isSelected = false })
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
      if (!seat.isForbidden && newGroup.remaining > 0) {
        this.emptySeat(seat)
        seat.group = newGroup
        seat.isEmpty = newGroup === null // est vide si group null
        this.$emit('group-changed', { group: newGroup, count: 1 })
        return true
      }
      return false
    },

    placeGroupAuto: function (data) {
      let group = data.group
      let seat = data.seat
      let remaining = 'remaining' in group ? group.remaining : group.number
      remaining = remaining < 0 ? 0 : remaining

      if (seat && remaining) {
        // on met direct le nom du groupe sur le siège
        this.setSeat(seat, group)
      }
      // let lineDirection = seat.line < (this.lineCount / 2) ? 1 : -1
      let cellDirection = seat.cell < (this.cellCount / 2) ? 1 : -1
      cellDirection = 1 // tjr vers la droite

      // let lastLine = lineDirection === 1 ? this.lineCount - 1 : 0
      let lastCell = cellDirection === 1 ? this.cellCount - 1 : 0

      let currentLine = seat.line
      let currentCell = seat.cell
      let currentSeat = this.findSeat(currentLine, currentCell)

      let stop = false
      do {
        remaining = group.remaining
        currentCell += cellDirection
        currentSeat = this.findSeat(currentLine, currentCell)
        stop = (cellDirection === 1 && currentCell > lastCell) ||
            (cellDirection === -1 && currentCell < lastCell) ||
            currentSeat.isEmpty === false ||
            currentSeat.isForbidden ||
            remaining === 0

        if (!stop) {
          // si on arrive à mettre la personne ici, on fait +1
          this.setSeat(currentSeat, group)
        }
        // let changeLine = currentCell > lastCell || this.findSeat(currentLine, currentLine).isEmpty === false
        // if (changeLine) {
        //   // bout de la ligne, on prend la ligne suivante
        //   currentCell = cellDirection === 1 ? 0 : cellCount - 1
        //   currentLine += lineDirection
        // }
        // // on check si la cell de la ligne suivante est ok, sinon on continue
        // stop = currentLine > lastLine && currentCell > lastCell
      } while (stop === false)
    },

    seatClick (seat) {
      if (seat) {
        // SELECTION AVEC SHIFT
        if (this.isShiftPressed && this.firstSelectedSeat) {
          // deselect tout et reselect toute la zone
          let firstSelectedSeat = this.firstSelectedSeat
          this.unselectAll()
          // on remet
          this.firstSelectedSeat = firstSelectedSeat

          let lineDirection = -(firstSelectedSeat.line - seat.line)
          if (lineDirection >= 0) lineDirection = 1
          if (lineDirection < -1) lineDirection = -1
          let cellDirection = -(firstSelectedSeat.cell - seat.cell)
          if (cellDirection >= 0) cellDirection = 1
          if (cellDirection < -1) cellDirection = -1

          let currentLine = firstSelectedSeat.line
          let currentCell = firstSelectedSeat.cell
          const startCell = currentCell

          // on fait un + direction car le while s'arrete un coup trop tôt
          const targetLine = seat.line + lineDirection
          const targetCell = seat.cell + cellDirection

          while (currentLine !== targetLine) {
            currentCell = startCell
            while (currentCell !== targetCell) {
              this.selectSeat(currentLine, currentCell)
              currentCell += cellDirection
            }
            currentLine += lineDirection
          }
          this.specialSelect = true
          this.selectSeat(firstSelectedSeat)
          this.selectSeat(seat)
        } else if (this.specialSelect) {
          this.specialSelect = false
          this.unselectAll()
          this.selectSeat(seat)
        }

        if (seat.isSelected) {
          // on vient de sélectionner un seat
          if (this.firstSelectedSeat === null) {
            // c'est le premier select
            this.firstSelectedSeat = seat
          }
        } else {
          // on vient de deselect un seat
          let nbSelect = this.getSelectedSeats().length
          if (nbSelect === 0) {
            // aucun select
            this.firstSelectedSeat = null
          }
        }
        // on envoie pour faire le lien avec grouplist
        this.$emit('select-seat', seat)
      }
    },

    keydown: function (event) {
      if (event.ctrlKey) {
        // CTRL
        if (event.keyCode === 65) {
          // CTRL + 'a'
          this.selectAll()
          event.preventDefault()
          return
        }
      }
      switch (event.keyCode) {
        case 16:
          // SHIFT
          this.isShiftPressed = true
          break
      }
    },
    keyup: function (event) {
      switch (event.keyCode) {
        case 16:
          // SHIFT
          this.isShiftPressed = false
          break

        case 27:
          // ESC
          this.unselectAll()
          break

        case 46:
          // SUPPR
          this.getSelectedSeats().forEach(s => this.emptySeat(s))
          this.unselectAll()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/plan.scss';
</style>
