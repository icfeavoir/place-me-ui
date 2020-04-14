<template>
  <div class="settings">
    <div class="settings-group">
      <p class="group-title">Notifications</p>
      <p v-if="constraintErrors && constraintErrors.length === 0" class="no-notif">Aucune notifications</p>
      <p class="constraint-error-line"
        v-for="constraint in constraintErrors"
        :key="constraint._id"
      >La contrainte <b>{{ constraint.name }}</b> n'est définie sur aucun plan. Vous pouvez la définir <router-link class="main-btn small-btn" :to="{name: 'Plans'}" >ici</router-link> ou, si cette contrainte existe déjà sous un autre nom, les fusionner <router-link class="main-btn small-btn" :to="{name: 'Constraints'}" >ici</router-link>.</p>
    </div>

    <div class="settings-group flex-group truncate-group">
      <p class="group-title">Zone dangereuse</p>
      <div class="truncate-bloc">
        <p class="title">GROUPES</p>
        <button @click="truncateGroups" class="main-btn del-btn">TOUT SUPPRIMER</button>
      </div>
      <div class="truncate-bloc">
        <p class="title">PLANS</p>
        <button @click="truncatePlans" class="main-btn del-btn">TOUT SUPPRIMER</button>
      </div>
      <div class="truncate-bloc">
        <p class="title">ÉVÈNEMENTS</p>
        <button @click="truncateEvents" class="main-btn del-btn">TOUT SUPPRIMER</button>
      </div>
      <div class="truncate-bloc">
        <p class="title">CONTRAINTES</p>
        <button @click="truncateConstraints" class="main-btn del-btn">TOUT SUPPRIMER</button>
      </div>
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
      constraintErrors: null
    }
  },
  mounted () {
    constraintService.getEmptyConstraints().then(emptyConstraints => {
      this.$set(this, 'constraintErrors', emptyConstraints)
    })
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
