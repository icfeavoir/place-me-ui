<template>
  <div class='groups'>
    <button><router-link :to='{name: "GroupNew"}'>New group</router-link></button>
    <br><br>

    <div class="group" v-for='group in groups' :key='group._id'>
      <router-link :to='{name: "GroupPage", params: {groupId: group.id}}'>
        {{ group.name }}<br>
        {{ group.number }} persons<br>
        {{ group.event.name}}<br>
      </router-link>
      <button @click="delGroup(group.id)">DEL</button>
    </div>
  </div>
</template>

<script>
import groupService from '../services/group.service'
export default {
  name: 'Groups',
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
    delGroup: function (id) {
      if (id) {
        groupService.delete(id).then(res => {
          if (res.success) {
            // remove from groups
            this.groups = this.groups.filter((group) => {
              return group.id !== id
            })
          }
        })
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.groups {
  width: 80%;
  margin: 0 auto;
}
.group {
  border-radius: 3px;
  color: #FFFFFF;
  display: inline-block;
  text-decoration: none;
  width: 15%;
  padding: 10px;
  background-color: rgb(0, 121, 191);
  margin: 0 15px 15px 0;
}
</style>
