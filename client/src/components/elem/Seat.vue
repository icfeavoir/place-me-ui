<template>
<!-- TODO: forbidden seat -->
  <td :style="style" @click="onClick">
    <drop class="drop" @drop="onDrop">
      <drag class="drag" :draggable="seat && !seat.isEmpty" :transfer-data="seat && seat.group ? {group: seat.group, fromSeat: true, prevSeat: seat} : null">
        <p>{{ seat && seat.group ? seat.group.name : '' }}</p>
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
    color: String,
    borderColor: String,
    bgColor: String,
    line: Number,
    cell: Number,
    size: Number
  },
  created: function () {
  },
  computed: {
    style: function () {
      return {
        minWidth: this.sizeComp + 'px',
        width: this.sizeComp + 'px',
        maxWidth: this.sizeComp + 'px',
        height: this.sizeComp + 'px',
        color: this.color || 'white',
        backgroundColor: this.bgColor || 'black',
        border: this.borderSize + 'px ' + this.borderStyle + ' ' + (this.borderColor || 'red'),
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
