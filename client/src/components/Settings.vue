<template>
  <div class="settings">
    <div class="settings-group">
      <p class="group-title">Notifications</p>
      <p v-if="constraintErrors && constraintErrors.length === 0" class="no-notif">Aucune notifications</p>
      <p class="constraint-error-line"
        v-for="constraint in constraintErrors"
        :key="constraint._id"
      >La contrainte <b>{{ constraint.name }}</b> n'est définie sur aucun plan. Vous pouvez la définir <router-link :to="{name: 'Plans'}" ><PrettyButton class="small-btn inline">ici</PrettyButton></router-link> ou, si cette contrainte existe déjà sous un autre nom, les fusionner <router-link :to="{name: 'Constraints'}" ><PrettyButton class="small-btn inline">ici</PrettyButton></router-link>.</p>
    </div>

    <div class="settings-group">
      <p class="group-title">Paramètres</p>
      <p v-if="settings && settings.length === 0" class="no-notif">Aucun paramètre</p>
      <form>
        <div
          v-for="setting in settings"
          :key="setting._id"
        >
          <label>{{ setting.params.name }}</label><input :type="setting.params.type" :placeholder="setting.params.name" v-model="setting.value" />
        </div>
        <PrettyButton class="center" @click="saveSettings">Enregistrer</PrettyButton>
      </form>
    </div>

    <div class="settings-group flex-group truncate-group">
      <p class="group-title">Suppression</p>
      <div class="truncate-bloc">
        <p class="title">GROUPES</p>
        <PrettyButton :allowSmall="false" @click="truncateGroups" class="small-btn center del-btn">TOUT SUPPRIMER</PrettyButton>
      </div>
      <div class="truncate-bloc">
        <p class="title">PLANS</p>
        <PrettyButton :allowSmall="false" @click="truncatePlans" class="small-btn center del-btn">TOUT SUPPRIMER</PrettyButton>
      </div>
      <div class="truncate-bloc">
        <p class="title">ÉVÈNEMENTS</p>
        <PrettyButton :allowSmall="false" @click="truncateEvents" class="small-btn center del-btn">TOUT SUPPRIMER</PrettyButton>
      </div>
      <div class="truncate-bloc">
        <p class="title">CONTRAINTES</p>
        <PrettyButton :allowSmall="false" @click="truncateConstraints" class="small-btn center del-btn">TOUT SUPPRIMER</PrettyButton>
      </div>
    </div>
  </div>
</template>

<script>
import groupService from '@/services/group.service'
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'
import constraintService from '@/services/constraint.service'
import settingService from '@/services/setting.service'

import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'Settings',
  components: {
    PrettyButton
  },
  data () {
    return {
      constraintErrors: null,
      settings: null,
      params: [
        {dbName: 'plan_default_size', name: 'Taille du plan par défaut', type: 'number'}
      ]
    }
  },
  mounted () {
    constraintService.getEmptyConstraints().then(emptyConstraints => {
      this.$set(this, 'constraintErrors', emptyConstraints)
    })
    settingService.getAll().then(settings => {
      settings.forEach(setting => {
        setting.params = this.params.find(p => p.dbName === setting.name)
      })
      this.$set(this, 'settings', settings)
    })
  },

  methods: {
    saveSettings () {
      let allRequests = []
      this.settings.forEach(setting => {
        allRequests.push(settingService.set({name: setting.name, value: setting.value}))
      })
      Promise.all(allRequests).then(resSettings => {
        let success = true
        resSettings.forEach(resSetting => {
          if (resSetting.error) {
            this.$toasted.error(resSetting.error, {icon: 'ban'})
            success = false
          }
        })
        if (success) {
          // pas d'erreur détectée
          this.$toasted.success('Enregistré !')
        }
      })
    },

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
<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
