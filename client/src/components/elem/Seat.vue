<template>
  <td :style="style" @click="onClick" :class="isForbidden ? 'forbidden' : ''" v-tooltip="tooltip">
    <drop class="drop" @drop="onDrop">
      <drag
        class="drag"
        v-if="group"
        :draggable="draggable"
        :transfer-data="group ? {group: group, fromAnotherSeat: true, prevSeat: seat} : null"
      >
        <p>{{ group ? group.name : '' }}</p>
      </drag>
    </drop>
  </td>
</template>

<script>
export default {
  name: 'Seat',
  data () {
    return {
      foregroundColor: ''
    }
  },
  props: {
    seat: Object,
    size: Number
  },
  mounted () {
    this.foregroundColor = this.colors.lighterGrey
  },
  computed: {
    style () {
      return {
        color: this.foregroundColor,
        backgroundColor: this.bgColor || this.colors.bgColor,
        border: this.borderSize + 'px ' + this.borderStyle + ' ' + this.borderColor,
        opacity: this.opacity
      }
    },
    sizeComp () {
      return this.size || 50
    },
    borderSize () {
      return this.isForbidden ? 0 : this.isSelected ? 2 : 1
    },
    borderStyle () {
      return this.isSelected ? 'dashed' : 'solid'
    },
    borderColor () {
      if (!this.isError) {
        return this.isSelected ? this.colors.lighterGrey : this.colors.lightGrey
      } else {
        return this.colors.lightRed
      }
    },
    bgColor () {
      if (this.isForbidden) {
        return this.colors.mainRed
      } else if (this.group) {
        return this.group.color
      } else if (this.isSelected) {
        return this.colors.darkGrey
      } else {
        return this.colors.bgColor
      }
    },
    opacity () {
      return this.isSelected || this.isForbidden ? 1 : 0.75
    },

    group () {
      return this.seat ? this.seat.group : null
    },
    constraint () {
      return this.seat ? this.seat.constraint : null
    },
    constraintText () {
      return this.constraint ? this.constraint.text : ''
    },
    tooltip () {
      // TODO: add isolated
      if (this.constraint) {
        return {
          content: this.constraintText,
          classes: ['tooltip-md'],
          html: true,
          delay: {show: 500}
        }
      } else if (this.isIsolated) {
        return {
          content: 'Cette personne est seule. Elle devrait être placée avec son groupe.',
          classes: ['tooltip-md'],
          html: true,
          delay: {show: 500}
        }
      } else {
        return null
      }
    },
    line () {
      return this.seat.line
    },
    cell () {
      return this.seat.cell
    },

    isForbidden () {
      return this.seat ? this.seat.isForbidden : true
    },
    draggable () {
      return this.seat && !this.seat.isEmpty && !this.seat.isForbidden
    },
    isSelected () {
      return this.seat.isSelected
    },
    isIsolated () {
      return this.seat && this.seat.group ? this.seat.isIsolated : false
    },
    // isConstraintOk () {
    //   if (this.constraint === null || this.constraintSeats.length === 0) {
    //     return true
    //   } else {
    //     // on regarde si le siège fait partie des sièges de la contrainte
    //     for (let i = 0; i < this.constraintSeats.length; i++) { // boucle pour break en faisant return
    //       let cSeat = this.constraint.constraint_seats[i]
    //       if (cSeat.line === this.line && cSeat.cell === this.cell) {
    //         return true
    //       }
    //     }
    //   }
    // return false
    // },
    isError () {
      return this.constraint || this.isIsolated
    }
  },
  methods: {
    onClick: function (e) {
      this.seat.isSelected = !this.isSelected && !this.isForbidden
      this.$emit('seat-click', this.seat)
    },

    onDrop: function (drop) {
      if (!this.isForbidden && drop) {
        drop.seat = this.seat
        this.$emit('place-group', drop)
        this.$emit('group-dropped', this.seat.group)
      }
    }
  },
  watch: {
    group (newGroup, oldGroup) {
      this.seat.isEmpty = this.group === null
      if (this.group) {
        if (this.group.color) {
          this.foregroundColor = this.shoulColorBeDark(this.bgColor) ? this.colors.bgColor : this.colors.lighterGrey
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/seat.scss';
</style>
