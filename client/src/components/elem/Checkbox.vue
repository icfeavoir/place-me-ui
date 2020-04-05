<template>
  <label class="special-checkbox"><p class="text"><slot></slot></p>
    <input type="checkbox" v-model="checked" @change="$emit('update:checked', checked)" >
    <span class="checkmark" :style="style"></span>
  </label>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    textRevert: false
  },
  computed: {
    style: function () {
      return this.textRevert ? {right: '0px'} : {left: '0px'}
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/special-checkbox.scss';
</style>
