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
export default {
  data () {
    return {
      menu: [
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
        }
      ]
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
  computed: {
    width () {
      return this.isPortrait ? '100%' : '250px'
    },
    widthCollapsed () {
      return this.isPortrait ? '100%' : '50px'
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/menu.scss';
</style>
