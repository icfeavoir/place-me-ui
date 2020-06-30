<template id="all">
  <div id='app' :style="{paddingLeft: paddingLeft + 'px', paddingTop: paddingTop + 'px'}">
    <Menu ref="menu" @onToggleCollapse="onToggleCollapse" :isPortrait="isPortrait" :isSmallWidth="isSmallWidth"/>
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
      paddingLeft: 250,
      isPortrait: false,
      isSmallWidth: false
    }
  },
  created () {
    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  mounted () {
    this.resize()
    this.checkErrors()

    // DEMO : popup pour informer de la liberté !
    // Local storage => str
    if (!localStorage.freeToUse || localStorage.freeToUse === 'false') {
      let msg = {
        title: 'Place Me',
        body: 'Sur cette démonstration, vous êtes libre ! Vous pouvez ajouter - modifier - supprimer des réservations, des plans, des évènements !'
      }
      let options = {
        okText: 'C\'est compris !',
        cancelText: 'Fermer',
        backdropClose: false
      }
      this.$dialog
        .confirm(msg, options)
        .then(function (dialog) {})
        .catch(function () {})

      // Dans tous les cas
      localStorage.freeToUse = true
    }
  },
  methods: {
    resize () {
      this.isPortrait = this.isPortraitView()
      this.isSmallWidth = this.isSmallWidthScreen()
    },
    onToggleCollapse: function (collapse) {
      if (this.isPortrait) {
        this.paddingLeft = 0
        this.paddingTop = 50
      } else {
        this.paddingLeft = collapse ? 50 : 250
        this.paddingTop = 0
      }
    },
    checkErrors () {
      if (this.$refs.menu) {
        this.$refs.menu.checkErrors()
      }
    }
  },
  watch: {
    isPortrait () {
      this.onToggleCollapse(this.isPortrait)
    },
    isSmallWidth () {
      this.onToggleCollapse(this.isSmallWidth)
    },
    $route (to, from) {
      this.checkErrors()
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
