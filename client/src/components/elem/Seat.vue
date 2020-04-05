<template>
<!-- TODO: forbidden seat -->
  <td :style="style" @click="onClick">
    <drop class="drop" @drop="onDrop">
      <drag class="drag" :draggable="seat && !seat.isEmpty" :transfer-data="group ? {group: group, fromSeat: true, prevSeat: seat} : null">
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
      isSelected: false
    }
  },
  props: {
    seat: Object,
    forbidden: Boolean,
    borderColor: String,
    line: Number,
    cell: Number,
    size: Number
  },
  computed: {
    style: function () {
      return {
        minWidth: this.sizeComp + 'px',
        width: this.sizeComp + 'px',
        maxWidth: this.sizeComp + 'px',
        height: this.sizeComp + 'px',
        color: this.color || this.colors.lighterGrey,
        backgroundColor: this.bgColor || this.colors.bgColor,
        border: this.borderSize + 'px ' + this.borderStyle + ' ' + (this.borderColor || this.colors.lightGrey),
        fontSize: '10px'
      }
    },
    sizeComp: function () {
      return this.size || 50
    },
    borderSize: function () {
      return this.isSelected ? 3 : 1
    },
    borderStyle: function () {
      return this.isSelected ? 'dashed' : 'solid'
    },
    color () {
      return this.shoulColorBeDark(this.bgColor) ? this.colors.bgColor : this.colors.lighterGrey
    },
    bgColor: function () {
      return this.group ? this.group.color : null
    },
    group: function () {
      return this.seat ? this.seat.group : null
    }
  },
  methods: {
    onClick: function (e) {
      this.isSelected = !this.isSelected
    },

    onDrop: function (drop) {
      if (drop) {
        drop.seat = this.seat
        this.$emit('place-group', drop)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/seat.scss';
</style>
