<template>
  <div
    class="pretty-btn"
    :class="{hoverable: isClickable, 'allow-small': allowSmall, classes}"
    :style="style"
    @click.stop="isClickable ? $emit('click') : null"
  >
    <i v-if="icon" :class="'fa fa-' + icon"></i>
    <a v-if="showText"><slot></slot></a>
  </div>
</template>

<script>
export default {
  name: 'PrettyButton',
  data () {
    return {
      isLargeScreen: false
    }
  },
  props: {
    icon: {
      type: String,
      default: null
    },
    classes: {
      type: String,
      default: null
    },
    allowSmall: {
      type: Boolean,
      default: true
    },
    isClickable: {
      type: Boolean,
      default: true
    },
    style: {
      type: Object,
      default () { return {} }
    }
  },
  created () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      this.isLargeScreen = !(this.isPortraitView() || this.isSmallWidthScreen())
    }
  },
  computed: {
    showText () {
      return this.isLargeScreen || !this.allowSmall
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/pretty-button.scss';
</style>
