<template>
  <div ref="plan" class='event-plan' v-if="seats">
    <div ref="zoomContainer" class="zoom-container">
      <button @click="zoom(1)"><i class="fa fa-plus"></i></button>
      <button @click="zoom(-1)"><i class="fa fa-minus"></i></button>
    </div>
    <div class="plan-selector" :style="selectorStyle"></div>
    <table class="seats" ref="seatsTable">
      <tr v-for="line in lineCount" :key="line">
        <Seat
          v-for="cell in cellCount"
          ref="seats"
          :key="line + '_' + cell"
          :seat="seats.find(s => s.line === (line - 1) && s.cell === (cell - 1))"
          :isSelectable="isSelectable"
          :size="size"
          :allowDrag="isDraggable"
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
    plan: Object,
    isSelectable: {
      type: Boolean,
      default: true
    },
    multipleSelect: {
      type: Boolean,
      default: true
    },
    isDraggable: {
      type: Boolean,
      default: true
    },
    keyListenning: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      seats: [],
      lineCount: 0,
      cellCount: 0,
      // select with shift
      isShiftPressed: false,
      firstSelectedSeat: null,
      specialSelect: false,
      // selector
      selectorStyle: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        realLeft: 0,
        realTop: 0,
        realWidth: 0,
        realHeight: 0,
        leftStart: 0,
        topStart: 0
      },
      isSelecting: false,
      size: 50
    }
  },
  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
    window.addEventListener('mousemove', this.mouseMove, true)
    window.addEventListener('mousedown', this.mouseDown, true)
    window.addEventListener('mouseup', this.mouseUp, true)
  },
  deleted () {
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('keyup', this.keyup)
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mousedown', this.mouseDown)
    window.removeEventListener('mouseup', this.mouseUp)
  },
  mounted () {
    if (this.plan) {
      this.lineCount = this.plan.height
      this.cellCount = this.plan.width
      for (var line = 0; line < this.lineCount; line++) {
        for (var cell = 0; cell < this.cellCount; cell++) {
          let isForbidden = this.plan.forbiddenSeats && this.plan.forbiddenSeats.filter(fs => fs.line === line && fs.cell === cell).length > 0
          this.seats.push({
            group: null,
            isEmpty: true,
            isForbidden: isForbidden,
            line: line,
            cell: cell,
            isSelected: false,
            isIsolated: false,
            constraint: null
          })
        }
      }

      let storedSize = Number.parseInt(localStorage.size)
      this.size = Number.isInteger(storedSize) ? storedSize : this.size
    }
  },
  methods: {
    /**
     * ce doit être LA SEULE méthode appelée
     * @param data Object {seat: Object, group: Object, [auto, setSeat, fromAnotherSeat, del, delGroup]}
     * @param saved Boolean Faut-il enregistrer les modifs ?
     */
    placeGroup: function (data, saved = true) {
      let updatedGroups = []
      if (data.auto) {
        // essaie de placer les gens en auto
        let allowChangeLine = this.isShiftPressed || data.allowChangeLine
        updatedGroups = this.placeGroupAuto(data, allowChangeLine)
      } else if (data.setSeat) {
        // mode simple : group vers seat
        if (!data.seat.isEmpty && data.seat.group.id === data.group.id) {
          // même groupe
        } else {
          let {oldGroup, newGroup} = this.setSeat(data.seat, data.group)
          // MAJ
          updatedGroups = this.addUpdatedGroup(updatedGroups, oldGroup)
          updatedGroups = this.addUpdatedGroup(updatedGroups, newGroup)
        }
      } else if (data.fromAnotherSeat) {
        if (data.prevSeat === data.seat) {
          // on a drag&drop un seat sur lui même
        } else {
          // on enlève le group dragged
          let draggedGroup = this.emptySeat(data.prevSeat)
          // on assigne
          let {oldGroup, newGroup} = this.setSeat(data.seat, data.group)
          // MAJ (cas particulier:  groupe draggé sur lui-même)
          updatedGroups = this.addUpdatedGroup(updatedGroups, draggedGroup)
          updatedGroups = this.addUpdatedGroup(updatedGroups, oldGroup)
          updatedGroups = this.addUpdatedGroup(updatedGroups, newGroup)
          // on annule le selector
          this.isSelecting = false
          this.mouseUp()
        }
      } else if (data.del) {
        if (data.seat.isEmpty) {
          // le siège est vide
        } else {
          // suppr le siège
          data.group = null
          let oldGroup = this.emptySeat(data.seat)
          // MAJ
          updatedGroups = this.addUpdatedGroup(updatedGroups, oldGroup)
        }
      } else if (data.delGroup) {
        if (data.groupId) {
          this.getGroupSeats(data.groupId).forEach(seat => {
            this.placeGroup({del: true, seat: seat}, saved)
          })
          // MAJ
          updatedGroups = this.addUpdatedGroup(updatedGroups, data.groupId)
        }
      }

      let hasChanged = updatedGroups.length > 0
      if (saved && hasChanged) {
        // on emet pour donner la modif
        this.$emit('save')
      }
      this.$emit('groups-changed', updatedGroups)
    },

    addUpdatedGroup (groups, groupId) {
      if (groupId !== null && typeof groupId === 'object') {
        groupId = groupId.id
      }
      if (groupId && !groups.includes(groupId)) {
        groups.push(groupId)
      }
      return groups
    },

    findSeat: function (line, cell) {
      return this.seats.find(s => s.line === line && s.cell === cell)
    },
    getAllSeats () {
      return this.seats
    },
    getSelectedSeats () {
      return this.seats.filter(s => s.isSelected)
    },
    getFilledSeats () {
      return this.seats.filter(s => !s.isEmpty)
    },
    getEmptySeats () {
      return this.seats.filter(s => s.isEmpty && !s.isForbidden)
    },
    getGroupSeats (groupId) { // retourne tous les sièges de ce groupe
      return this.seats.filter(s => !s.isEmpty && s.group && s.group.id === groupId)
    },
    selectSeat (seat, cell = null) {
      if (!this.isSelectable) {
        return
      }
      if (cell !== null) {
        // line, cell
        seat = this.findSeat(seat, cell)
      }
      if (seat) {
        seat.isSelected = true
      }
    },
    selectAll () {
      if (!this.multipleSelect) {
        return
      }
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
        let oldGroup = seat.group
        seat.group = null
        seat.isEmpty = true
        return oldGroup
      }
      return null
    },
    setSeat: function (seat, newGroup) {
      if (!seat.isForbidden && newGroup.remaining > 0) {
        if (!seat.isEmpty && seat.group.id === newGroup.id) {
          // on a rien changé
          return false
        }
        let oldGroup = this.emptySeat(seat)
        seat.group = newGroup
        seat.isEmpty = newGroup === null // est vide si group null
        this.$emit('group-changed', { group: newGroup, count: 1 })
        return {oldGroup: oldGroup, newGroup: newGroup}
      }
      return false
    },

    placeGroupAuto: function (data, allowChangeLine = false) {
      let group = data.group
      let seat = data.seat
      let remaining = 'remaining' in group ? group.remaining : group.number
      let updatedGroups = []
      remaining = remaining < 0 ? 0 : remaining

      if (seat && remaining) {
        // on met direct le nom du groupe sur le siège
        let {oldGroup, newGroup} = this.setSeat(seat, group)
        // MAJ
        this.addUpdatedGroup(updatedGroups, oldGroup)
        this.addUpdatedGroup(updatedGroups, newGroup)
      }

      const startCell = seat.cell

      let lineDirection = 1 // toujours vers le bas
      let cellDirection = 1 // toujours vers la droite

      let lastLine = lineDirection === 1 ? this.lineCount - 1 : 0
      let lastCell = cellDirection === 1 ? this.cellCount - 1 : 0

      let currentLine = seat.line
      let currentCell = seat.cell
      let currentSeat = this.findSeat(currentLine, currentCell)

      let stop = false
      do {
        remaining = group.remaining
        currentCell += cellDirection
        currentSeat = this.findSeat(currentLine, currentCell)
        let changeLine = allowChangeLine &&
            ((cellDirection === 1 && currentCell > lastCell) ||
            (cellDirection === -1 && currentCell < lastCell) ||
            currentSeat.isEmpty === false ||
            currentSeat.isForbidden)
        if (changeLine) {
          // bout de la ligne, on prend la ligne suivante
          currentCell = startCell
          currentLine += lineDirection
          currentSeat = this.findSeat(currentLine, currentCell)
        }
        // on check si la cell de la ligne suivante est ok, sinon on continue
        stop = (lineDirection === 1 && currentLine > lastLine) ||
            (lineDirection === -1 && currentLine < lastLine) ||
            !currentSeat ||
            currentSeat.isEmpty === false ||
            currentSeat.isForbidden ||
            remaining === 0
        // on regarde si on peut ajouter
        if (!stop) {
          let {oldGroup, newGroup} = this.setSeat(currentSeat, group)
          // MAJ
          this.addUpdatedGroup(updatedGroups, oldGroup)
          this.addUpdatedGroup(updatedGroups, newGroup)
        }
      } while (stop === false)

      return updatedGroups
    },

    selectSeveralSeats (firstSeat, lastSeat) {
      if (!this.multipleSelect) {
        return
      }
      this.unselectAll()
      let lineDirection = -(firstSeat.line - lastSeat.line)
      if (lineDirection >= 0) lineDirection = 1
      if (lineDirection < -1) lineDirection = -1
      let cellDirection = -(firstSeat.cell - lastSeat.cell)
      if (cellDirection >= 0) cellDirection = 1
      if (cellDirection < -1) cellDirection = -1

      let currentLine = firstSeat.line
      let currentCell = firstSeat.cell
      const startCell = currentCell

      // on fait un + direction car le while s'arrete un coup trop tôt
      const targetLine = lastSeat.line + lineDirection
      const targetCell = lastSeat.cell + cellDirection

      while (currentLine !== targetLine) {
        currentCell = startCell
        while (currentCell !== targetCell) {
          this.selectSeat(currentLine, currentCell)
          currentCell += cellDirection
        }
        currentLine += lineDirection
      }
      this.specialSelect = true
      this.selectSeat(firstSeat)
      this.selectSeat(lastSeat)
    },

    seatClick (seat) {
      if (seat) {
        // SELECTION AVEC SHIFT
        if (this.isShiftPressed && this.firstSelectedSeat) {
          // deselect tout et reselect toute la zone
          let firstSelectedSeat = this.firstSelectedSeat
          this.selectSeveralSeats(firstSelectedSeat, seat)
          // on remet
          this.firstSelectedSeat = firstSelectedSeat
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
        // on envoie pour faire le lien avec le parent du plan
      }
      this.$emit('select-seat', seat)
    },

    setSelectedSeatsWithSelector () {
      if (this.$refs.seats) {
        let seats = []
        let scroll = this.getPlanScroll()
        this.$refs.seats.forEach(seat => { // attention: c'est le seat sous forme html
          let left = seat.$el.offsetLeft + seat.$parent.$el.offsetLeft
          let top = seat.$el.offsetTop + seat.$parent.$el.offsetTop + this.$refs.zoomContainer.offsetHeight
          let right = left + seat.$el.offsetWidth
          let bottom = top + seat.$el.offsetHeight

          // on prend les extrêmes
          let selectorPoints = [
            {x: this.selectorStyle.realLeft + scroll.scrollLeft, y: this.selectorStyle.realTop + scroll.scrollTop},
            {x: this.selectorStyle.realLeft + this.selectorStyle.realWidth + scroll.scrollLeft, y: this.selectorStyle.realTop + this.selectorStyle.realHeight + scroll.scrollTop}
          ]

          // on prend chaque point du selecteur et on regarde s'il est dans le seat
          for (let i = 0; i < selectorPoints.length; i++) {
            let point = selectorPoints[i]
            if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom) {
              seats.push(seat.seat)
              break
            }
          }
        })
        if (seats.length === 2) {
          this.selectSeveralSeats(seats[0], seats[1])
        }
      }
    },

    supprSelectedGroups () {
      let count = 0
      this.getSelectedSeats().forEach(s => {
        this.placeGroup({seat: s, del: true})
        count++
      })
      this.unselectAll()
      return count
    },

    zoom (update) {
      this.size += 5 * update
      this.size = Math.max(this.size, 5)
      this.size = Math.min(this.size, 150)
      localStorage.size = this.size
    },

    keydown: function (event) {
      if (!this.keyListenning) {
        return
      }
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
        case 107:
          // PLUS
          if (this.isShiftPressed) {
            this.zoom(1)
          }
          break
        case 109:
          // MOINS
          if (this.isShiftPressed) {
            this.zoom(-1)
          }
          break
      }
    },
    keyup: function (event) {
      if (!this.keyListenning) {
        return
      }
      switch (event.keyCode) {
        case 16:
          // SHIFT
          this.isShiftPressed = false
          break

        case 27:
          // ESC
          this.unselectAll()
          this.mouseUp(null)
          break

        case 46:
          // SUPPR
          this.supprSelectedGroups()
          break
      }
    },
    getPlanScroll () {
      let pos = {
        scrollTop: 0,
        scrollLeft: 0
      }
      if (this.$refs.plan) {
        pos.scrollTop = this.$refs.plan.scrollTop
        pos.scrollLeft = this.$refs.plan.scrollLeft
      }
      return pos
    },
    getTablePosition () {
      let pos = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
      if (this.$refs.seatsTable) {
        pos.left = this.$refs.seatsTable.offsetLeft
        pos.top = this.$refs.seatsTable.offsetTop
        pos.width = pos.left + this.$refs.seatsTable.offsetWidth
        pos.height = pos.top + this.$refs.seatsTable.offsetHeight
      }
      return pos
    },
    mouseMove (e) {
      if (this.isSelecting && this.multipleSelect) {
        let pos = this.getTablePosition()
        if (e.x >= pos.left && e.x <= pos.width && e.y >= pos.top && e.y <= pos.height) {
          let realTop = Math.min(this.selectorStyle.topStart, e.y)
          let realLeft = Math.min(this.selectorStyle.leftStart, e.x)
          let realWidth = Math.abs(this.selectorStyle.leftStart - e.x)
          let realHeight = Math.abs(this.selectorStyle.topStart - e.y)
          // nb
          this.selectorStyle.realTop = realTop
          this.selectorStyle.realLeft = realLeft
          this.selectorStyle.realWidth = realWidth
          this.selectorStyle.realHeight = realHeight
          // en px
          this.selectorStyle.top = realTop + 'px'
          this.selectorStyle.left = realLeft + 'px'
          this.selectorStyle.width = realWidth + 'px'
          this.selectorStyle.height = realHeight + 'px'
        }
      }
    },
    mouseDown (e) {
      let pos = this.getTablePosition()
      if (e.x >= pos.left && e.x <= pos.width && e.y >= pos.top && e.y <= pos.height) {
        this.isSelecting = true
        this.selectorStyle.leftStart = e.x
        this.selectorStyle.topStart = e.y
      }
    },
    mouseUp (e) {
      if (e) {
        let mouseMoved = e.x !== this.selectorStyle.leftStart && e.y !== this.selectorStyle.topStart
        if (this.isSelecting && this.multipleSelect && mouseMoved) {
          // on select les seats
          this.setSelectedSeatsWithSelector()
        }
      }
      this.isSelecting = false
      this.selectorStyle.leftStart = 0
      this.selectorStyle.topStart = 0
      this.selectorStyle.left = 0
      this.selectorStyle.top = 0
      this.selectorStyle.width = 0
      this.selectorStyle.height = 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/plan.scss';
</style>
