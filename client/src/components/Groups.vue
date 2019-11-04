<template>
  <div class='groups'>
    <router-link v-for='group in groups' class='group' :key='group._id' :to='{name: "GroupPage", params: {groupId: group.id}}'>
      {{ group.name }}<br>
      {{ group.number }} persons<br>
      {{ group.event.name}}
    </router-link>
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
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.groups {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.group {
  border-radius: 3px;
  color: #FFFFFF;
  display: block;
  text-decoration: none;
  width: 15%;
  min-width: 150px;
  min-height: 80px;
  padding: 10px;
  background-color: rgb(0, 121, 191);
  margin: 0 15px 15px 0;
}
</style>
