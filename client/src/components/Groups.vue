<template>
  <div>
    <router-link class="btn-lg-container" :to='{name: "GroupNew"}'><button class="btn-lg"><i class="fa fa-plus-circle"></i>Nouvelle réservation</button></router-link>

    <p class="search">Rechercher</p>
    <div class='groups'>

      <div class="group" v-for='group in groups' :key='group._id'>
        <!-- <router-link :to='{name: "GroupPage", params: {groupId: group.id}}'>
          {{ group.name }}<br>
          {{ group.number }} persons<br>
          {{ group.event.name}} in {{ group.plan.name }}<br>
        </router-link>
        <button @click="delGroup(group.id)">DEL</button> -->
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
      groups: []
    }
  },
  mounted () {
    groupService.getAll()
      .then((groups) => {
        this.$set(this, 'groups', groups)
      })
  },
  methods: {
    deleteGroup: function (group) {
      const id = group.id
      const it = this
      if (id) {
        let options = {
          okText: 'Valider',
          cancelText: 'Fermer',
          backdropClose: true
        }
        this.$dialog
          .confirm('Voulez-vous supprimer la réservation de ' + group.name + ' ?', options)
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../scss/groups.scss';
</style>
