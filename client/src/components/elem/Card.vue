<template>
  <router-link :to='{name: url, params: params}'>
    <div class='card'>
      <p class="title">{{ title }}</p>
      <div class="number-container"><p class="number">{{ number }}</p></div>
      <p class="desc">{{ data.desc }}</p>
      <button class="del" @click.stop.prevent="$emit('delete-group', data.obj)"><i class="fa fa-trash"></i></button>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Groups',
  data () {
    return {
    }
  },
  props: {
    url: String,
    params: Object,
    data: Object,
    delId: Number
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    title: function () {
      return this.data.title.length <= 20 ? this.data.title : (this.data.title.substring(0, 17) + '...')
    },
    number: function () {
      var num = '' + this.data.number
      return num.length <= 3 ? num : num.substring(0, 3)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/card.scss';
</style>
