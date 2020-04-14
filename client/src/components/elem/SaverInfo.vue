<template>
  <p class="saver allow-small" :class="{clickable: !auto}" :style="savedStyle" @click="auto ? null : $emit('click')">
    <i v-if="isSaved" class="i-only-center fa fa-check fa-sm"></i>
    <i v-else-if="auto || isSaving" class="i-only-center fa fa-spinner fa-spin fa-sm"></i>
    <i v-else class="i-only-center fa fa-save fa-sm"></i>
    <a v-if="isLargeScreen">{{ savedText }}</a>
  </p>
</template>

<script>
export default {
  name: 'SaverInfo',
  data () {
    return {
    }
  },
  props: {
    isSaved: {
      type: Boolean,
      default: true
    },
    auto: {
      type: Boolean,
      default: true
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    savedStyle () {
      return {
        color: this.isSaved ? this.colors.mainGreen : this.colors.mainRed,
        border: this.isSaved ? '1px solid ' + this.colors.mainGreen : 'none'
      }
    },
    savedText () {
      return this.isSaved ? 'Sauvegardé' : (this.auto ? 'Sauvegarde...' : 'Sauvegarder')
    },

    isLargeScreen () {
      return !this.isPortraitView() && !this.isSmallWidthScreen()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/saver-info.scss';
</style>
