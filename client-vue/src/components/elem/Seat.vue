<template>
  <td :style="style" @click="onClick" :class="isForbidden ? 'forbidden' : ''" v-tooltip="isDragged ? null : tooltip">
    <drop class="drop" @drop="onDrop">
      <drag
        class="drag"
        v-if="group"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
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
      foregroundColor: '',
      isDragged: false
    }
  },
  props: {
    seat: Object,
    isSelectable: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 50
    },
    allowDrag: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.foregroundColor = this.colors.lighterGrey
  },
  computed: {
    style () {
      return {
        color: this.foregroundColor,
        background: this.bgColor || this.colors.bgColor,
        border: this.borderSize + 'px ' + this.borderStyle + ' ' + this.borderColor,
        opacity: this.opacity,
        minWidth: this.realSize + 'px',
        width: this.realSize + 'px',
        maxWidth: this.realSize + 'px',
        minHeight: this.realSize + 'px',
        height: this.realSize + 'px',
        maxHeight: this.realSize + 'px',
        fontSize: this.fontSize + 'px'
      }
    },
    realSize () {
      return this.isPortraitView() || this.isSmallWidthScreen() ? Math.max(this.size - 20, 10) : this.size
    },
    fontSize () {
      return this.realSize / 5
    },
    borderSize () {
      return this.isForbidden ? 0 : this.isSelected ? 2 : 1
    },
    borderStyle () {
      return this.isSelected ? 'dashed' : 'solid'
    },
    borderColor () {
      return this.isSelected ? this.colors.lighterGrey : this.colors.lightGrey
    },
    bgColor () {
      if (this.isForbidden) {
        return this.colors.mainRed
      } else if (this.group) {
        if (this.isError) {
          let errorColor = this.shoulColorBeDark(this.group.color) ? this.colors.mainRed : this.colors.lightRed
          return 'repeating-linear-gradient(45deg, ' +
          this.group.color + ' 0%, ' +
          this.group.color + ' 8%, ' +
          errorColor + ' 10%, ' +
          errorColor + ' 15%, ' +
          this.group.color + ' 17%, ' +
          this.group.color + ' 83%, ' +
          errorColor + ' 85%, ' +
          errorColor + ' 90%, ' +
          this.group.color + ' 92%, ' +
          this.group.color + ' 100% ' +
          ')'
        } else {
          return this.group.color
        }
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
      return this.seat && this.group ? this.seat.constraint : null
    },
    isContraintRespected () {
      return this.constraint ? this.constraint.isRespected : true
    },
    constraintText () {
      return this.constraint ? this.constraint.text : ''
    },
    tooltip () {
      if (!this.isContraintRespected) {
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
      return this.allowDrag && this.seat && !this.seat.isEmpty && !this.seat.isForbidden
    },
    isSelected () {
      return this.seat.isSelected
    },
    isIsolated () {
      return this.seat && this.seat.group ? this.seat.isIsolated : false
    },
    isError () {
      return !this.isContraintRespected || this.isIsolated
    }
  },
  methods: {
    onClick: function (e) {
      if (!this.isSelectable) {
        this.$emit('seat-click', null)
        return
      }
      this.seat.isSelected = !this.isSelected && !this.isForbidden
      this.$emit('seat-click', this.seat)
    },

    onDrop: function (drop) {
      if (!this.isForbidden && drop) {
        drop.seat = this.seat
        this.$emit('place-group', drop)
        this.isDragged = false
      }
    },
    onDragStart () {
      this.isDragged = true
    },
    onDragEnd () {
      this.isDragged = false
    }
  },
  watch: {
    group (newGroup, oldGroup) {
      this.seat.isEmpty = this.group === null
      if (this.group) {
        if (this.group.color) {
          this.foregroundColor = this.shoulColorBeDark(this.group.color) ? this.colors.bgColor : this.colors.lighterGrey
        }
      } else {
        this.seat.isIsolated = false
        this.seat.constraint = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/seat.scss';
</style>
