<template id="all">
  <div id='app' :style="{paddingLeft: paddingLeft + 'px'}">
    <Menu @onToggleCollapse="onToggleCollapse" />
    <div class="container"><router-view/></div>
  </div>
</template>

<script>
import Menu from './components/Menu'
export default {
  name: 'App',
  components: {
    Menu
  },
  data () {
    return {
      paddingLeft: 250
    }
  },
  methods: {
    onToggleCollapse: function (collapse) {
      this.paddingLeft = collapse ? 50 : 250
    }
  }
}
</script>

<style>
  @import './assets/css/fontawesome/css/all.css';
</style>

<style lang="scss">
  @import './scss/main.scss';
  @import './scss/tooltip.scss';
</style>
