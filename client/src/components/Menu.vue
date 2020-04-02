<template>
<sidebar-menu @toggle-collapse="$emit('onToggleCollapse', $event)" :menu="menu" :width="width" />
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
      ],
      width: '250px'
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/menu.scss';
</style>
