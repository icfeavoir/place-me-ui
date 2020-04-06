<template>
  <td :style="style" @click="onClick" :class="isForbidden ? 'forbidden' : ''">
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
    }
  },
  props: {
    seat: Object,
    size: Number
  },
  computed: {
    style () {
      return {
        minWidth: this.sizeComp + 'px',
        width: this.sizeComp + 'px',
        maxWidth: this.sizeComp + 'px',
        height: this.sizeComp + 'px',
        color: this.color || this.colors.lighterGrey,
        backgroundColor: this.bgColor || this.colors.bgColor,
        border: this.borderSize + 'px ' + this.borderStyle + ' ' + this.borderColor,
        fontSize: '10px',
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
      return this.isSelected ? this.colors.lighterGrey : this.colors.lightGrey
    },
    color () {
      return this.shoulColorBeDark(this.bgColor) ? this.colors.bgColor : this.colors.lighterGrey
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
    isForbidden () {
      return this.seat ? this.seat.isForbidden : true
    },
    draggable () {
      return this.seat && !this.seat.isEmpty && !this.seat.isForbidden
    },
    isSelected () {
      return this.seat.isSelected
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
      }
    }
  },
  watch: {
    group () {
      this.seat.isEmpty = this.group === null
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/seat.scss';
</style>
