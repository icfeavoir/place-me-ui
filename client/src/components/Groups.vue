<template>
  <div>
    <header>
      <input v-focus type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <router-link :to='{name: "GroupAdd"}'><button class="btn-lg"><i class="fa fa-plus-circle"></i>Nouvelle réservation</button></router-link>
    </header>
    <div class='groups'>
      <div class="group" v-for='group in groups' :key='group._id'>
        <Card
          url="GroupPage"
          :params="{groupId: group.id}"
          :data="{
            title: group.name,
            number: group.number,
            desc: group.event.name + ' en ' + group.plan.name,
            obj: group
          }"
          @delete-group='deleteGroup'
        />
      </div>
    </div>
  </div>
</template>

<script>
import groupService from '../services/group.service'
import Card from './elem/Card'
export default {
  name: 'Groups',
  components: {
    Card
  },
  data () {
    return {
      allGroups: [],
      groups: [],
      search: ''
    }
  },
  mounted () {
    groupService.getAll()
      .then((groups) => {
        this.$set(this, 'allGroups', groups)
        this.$set(this, 'groups', groups)
      })
  },
  methods: {
    deleteGroup: function (group) {
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
  @import '../scss/groups.scss';
</style>
