<template>
  <td :style=style @click="selected = !selected"><p><slot v-bind="text"></slot></p></td>
</template>

<script>
export default {
  name: 'Seat',
  data () {
    return {
      selected: false
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
  computed: {
    style: function () {
      return {
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
      return this.selected ? 3 : 1
    },
    borderStyle: function () {
      return this.selected ? 'dashed' : 'solid'
    }
  },
  methods: {
    onClick: function (e) {
      console.log(e)
    },

    onDrop: function (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/seat.scss';
</style>
