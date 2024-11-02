<template>
  <!-- <p class="saver allow-small" :class="{clickable: !auto}" :style="savedStyle" @click="auto ? null : $emit('click')">
    <i v-if="isSaved" class="fa fa-check fa-sm"></i>
    <i v-else-if="auto || isSaving" class="fa fa-spinner fa-spin fa-sm"></i>
    <i v-else class="fa fa-save fa-sm"></i>
    <a v-if="isLargeScreen">{{ savedText }}</a>
  </p> -->
  <PrettyButton :isClickable="!auto && !isSaved" :style="savedStyle" :icon="icon" @click="$emit('click')">{{ savedText }}</PrettyButton>
</template>

<script>
import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'SaverInfo',
  components: {
    PrettyButton
  },
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
    icon () {
      if (this.isSaved) {
        return 'check fa-sm'
      } else if (this.auto || this.isSaving) {
        return 'spinner fa-spin fa-sm'
      } else {
        return 'save fa-sm'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/saver-info.scss';
</style>
