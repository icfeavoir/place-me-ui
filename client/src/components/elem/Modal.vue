<template>
  <transition name="fade">
    <div class="modal-mask" @click="$emit('close-modal')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>

          <div class="modal-header">{{ title }}</div>

          <div class="modal-body"><slot></slot></div>

          <hr>
          <div class="modal-footer">
            <slot name="footer"></slot>
            <button class="dg-btn modal-button btn-modal-close" @click="$emit('close-modal')">Fermer</button>
            <button class="dg-btn modal-button btn-modal-valid" @click="$emit('valid-modal')">Valider</button>
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
    title: String
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/modal.scss';
</style>
