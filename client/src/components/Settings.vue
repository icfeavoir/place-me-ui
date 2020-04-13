<template>
  <div class="settings">
    <div class="settings-bloc">
      <p class="title">GROUPES</p>
      <button @click="truncateGroups" class="main-btn del-btn">TOUT SUPPRIMER</button>
    </div>
    <div class="settings-bloc">
      <p class="title">PLANS</p>
      <button @click="truncatePlans" class="main-btn del-btn">TOUT SUPPRIMER</button>
    </div>
    <div class="settings-bloc">
      <p class="title">ÉVÈNEMENTS</p>
      <button @click="truncateEvents" class="main-btn del-btn">TOUT SUPPRIMER</button>
    </div>
    <div class="settings-bloc">
      <p class="title">CONTRAINTES</p>
      <button @click="truncateConstraints" class="main-btn del-btn">TOUT SUPPRIMER</button>
    </div>
  </div>
</template>

<script>
import groupService from '@/services/group.service'
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'
import constraintService from '@/services/constraint.service'

export default {
  name: 'Settings',
  data () {
    return {
    }
  },
  methods: {
    truncateGroups () {
      const it = this
      this.confirmTruncate('tous les groupes').then(function (dialog) {
        groupService.delete(null).then(res => {
          it.$toasted.success('Supprimé !')
        })
      }).catch(function () {})
    },
    truncatePlans () {
      const it = this
      this.confirmTruncate('tous les plans').then(function (dialog) {
        planService.delete(null).then(res => {
          it.$toasted.success('Supprimé')
        })
      }).catch(function () {})
    },
    truncateEvents () {
      const it = this
      this.confirmTruncate('tous les évènements').then(function (dialog) {
        eventService.delete(null).then(res => {
          it.$toasted.success('Supprimé')
        })
      }).catch(function () {})
    },
    truncateConstraints () {
      const it = this
      this.confirmTruncate('toutes les contraintes').then(function (dialog) {
        constraintService.delete(null).then(res => {
          it.$toasted.success('Supprimé')
        })
      }).catch(function () {})
    },
    confirmTruncate (text) {
      let msg = {
        title: 'Tout supprimer',
        body: 'Voulez-vous supprimer ' + text + ' ? Cette opération n\'est pas réversible.'
      }
      let options = {
        okText: 'Valider',
        cancelText: 'Fermer',
        backdropClose: true
      }
      return this.$dialog.confirm(msg, options)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/settings.scss';
</style>
