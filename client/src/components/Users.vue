<template>
  <div class='users'>
    <router-link v-for='user in users' class='user' :key='user._id' :to='{name: "UserPage", params: {userId: user.id}}'>
      {{ user.firstName }} {{ user.lastName }}
    </router-link>
  </div>
</template>

<script>
import userService from '../services/user.service'
export default {
  name: 'Users',
  data () {
    return {
      users: []
    }
  },
  mounted () {
    userService.getAll()
      .then((users) => {
        this.$set(this, 'users', users)
      })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.users {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.user {
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
