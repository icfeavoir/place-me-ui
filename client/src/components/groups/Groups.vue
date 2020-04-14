<template>
  <div>
    <header>
      <input ref="search" type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <router-link :to='{name: "GroupAdd"}'><PrettyButton :allowSmall="false" icon="plus-circle">Nouvelle réservation</PrettyButton></router-link>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="groups && groups.length === 0">Aucun groupe</p>
      <div class="group" v-for='group in groups' :key='group._id'>
        <Card
          url="GroupPage"
          :params="{groupId: group.id}"
          :data="{
            title: group.name,
            number: group.number,
            desc: group.event_plan ? (group.event_plan.event.name + ' en ' + group.event_plan.plan.name) : 'Non placé !',
            obj: group
          }"
          @del='del'
        />
      </div>
    </div>
  </div>
</template>

<script>
import groupService from '@/services/group.service'

import Card from '@/components/elem/Card'
import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'Groups',
  components: {
    Card,
    PrettyButton
  },
  data () {
    return {
      allGroups: [],
      groups: null,
      search: ''
    }
  },
  mounted () {
    groupService.getAll()
      .then((groups) => {
        this.$set(this, 'allGroups', groups)
        this.$set(this, 'groups', groups)
      })
    if (this.isMobileAndTabletcheck() === false) {
      this.$refs.search.focus()
    }
  },
  methods: {
    del: function (group) {
      const id = group.id
      const it = this
      if (id) {
        let msg = {
          title: 'Supprimer une réservation',
          body: 'Voulez-vous supprimer la réservation de ' + group.name + ' ?'
        }
        let options = {
          okText: 'Valider',
          cancelText: 'Fermer',
          backdropClose: true
        }
        this.$dialog
          .confirm(msg, options)
          .then(function (dialog) {
            groupService.delete(id).then(res => {
              if (res.success) {
                // remove from groups
                it.groups = it.groups.filter((group) => {
                  return group.id !== id
                })
                it.$toasted.success('Supprimé !')
              }
            })
          })
          .catch(function () {})
      }
    },

    doSearch: function () {
      this.groups = this.allGroups.filter((group) => group.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/home-list.scss';
</style>
