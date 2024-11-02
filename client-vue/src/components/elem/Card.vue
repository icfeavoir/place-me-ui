<template>
  <router-link :to='{name: url, params: params}'>
    <div class='card' @click="$emit('click')">
      <p class="title">{{ title }}</p>
      <div v-if="number >= 0" class="number-container"><p class="number">{{ number }}</p></div>
      <p v-if="data.desc" class="desc">{{ data.desc }}</p>
      <div v-if="$slots.default" class="slot"><slot></slot></div>
      <button class="del" @click.stop.prevent="$emit('del', data.obj)"><i class="fa fa-trash"></i></button>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
    }
  },
  props: {
    url: String,
    params: Object,
    data: Object
  },
  mounted () {
  },
  computed: {
    title: function () {
      if (this.data && this.data.title) {
        return this.data.title.length <= 20 ? this.data.title : (this.data.title.substring(0, 17) + '...')
      } else {
        return ''
      }
    },
    number: function () {
      if (this.data && !Number.isNaN(this.data.number)) {
        return this.data.number > 999 ? '+999' : this.data.number
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/card.scss';
</style>
