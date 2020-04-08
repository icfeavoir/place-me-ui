<template>
  <transition name="fade">
    <div class="modal-mask" @click="$emit('close-modal')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop :style="compStyle">

          <div ref="header" v-if="title" class="modal-header">{{ title }}</div>

          <div class="modal-body" :style="{maxHeight: maxHeight + 'px'}"><slot></slot></div>

          <hr>
          <div ref="footer" v-if="footer" class="modal-footer">
            <slot name="footer"></slot>
            <button v-if="closeBtn" class="dg-btn modal-button btn-modal-close" @click="$emit('close-modal')">Fermer</button>
            <button v-if="validateBtn" class="dg-btn modal-button btn-modal-valid" @click="$emit('valid-modal')">Valider</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: String,
    modalStyle: Object,
    closeBtn: {
      type: Boolean,
      default: true
    },
    validateBtn: {
      type: Boolean,
      default: true
    },
    maxHeight: 0
  },
  created () {
    window.addEventListener('keydown', this.keydown)
    window.addEventListener('resize', this.setHeight)
  },
  destroyed () {
    window.addEventListener('keydown', this.keydown)
    window.removeEventListener('resize', this.setHeight)
  },
  mounted () {
    this.setHeight()
  },
  methods: {
    keydown: function (event) {
      switch (event.keyCode) {
        case 27:
          // ESC
          this.$emit('close-modal')
          break
      }
    },
    setHeight () {
      this.maxHeight = window.innerHeight - 2 * this.margin - this.$refs.header.offsetHeight - this.$refs.footer.offsetHeight - 50
    }
  },
  computed: {
    footer () {
      return this.closeBtn || this.validateBtn
    },
    style () {
      return this.modalStyle || {}
    },
    width () {
      return this.style.width || '30%'
    },
    margin () {
      return this.style.marginTop || 100
    },
    compStyle () {
      return {
        width: this.width,
        margin: this.margin + 'px auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/modal.scss';
</style>
