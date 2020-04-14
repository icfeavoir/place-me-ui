<template>
<sidebar-menu
  @toggle-collapse="$emit('onToggleCollapse', $event)"
  :menu="menu"
  :width="width"
  :widthCollapsed="widthCollapsed"
  :collapsed="isPortrait || isSmallWidth"
  :disableHover="true"
  :hideToggle="isPortrait"
/>
</template>

<script>
import constrainService from '@/services/constraint.service'

export default {
  data () {
    return {
      error: false
    }
  },
  props: {
    isPortrait: {
      type: Boolean,
      default: false
    },
    isSmallWidth: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
  },
  computed: {
    menu () {
      return [
        {
          header: true,
          title: 'Menu',
          hiddenOnCollapse: true
        },
        {
          href: '/',
          title: 'Réservations',
          icon: 'fa fa-user'
        },
        {
          href: '/events',
          title: 'Évènements',
          icon: 'fa fa-calendar-week'
        },
        {
          href: '/plans',
          title: 'Plans',
          icon: 'fa fa-th'
        },
        {
          href: '/settings',
          title: 'Paramètres',
          icon: 'fa fa-cog',
          class: this.error ? 'settings-error' : ''
        }
      ]
    },
    settingsClass () {
      return this.errors() ? 'settings-error' : ''
    },
    width () {
      return this.isPortrait ? '100%' : '250px'
    },
    widthCollapsed () {
      return this.isPortrait ? '100%' : '50px'
    }
  },
  methods: {
    checkErrors () {
      constrainService.getEmptyConstraints().then(emptyConstraints => {
        // on check si des contraintes sont vides
        if (emptyConstraints.length > 0) {
          this.error = true
        } else {
          this.error = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/menu.scss';
</style>
