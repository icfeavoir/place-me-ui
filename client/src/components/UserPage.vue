<template>
  <div class='user-page-main'>
    <template v-if='user'>
      <div class='user-firstName'>
        <h2>{{ user.firstName }}</h2>
      </div>
    </template>
  </div>
</template>

<script>
import userService from '../services/user.service'
export default {
  components: {

  },
  data () {
    return {
      user: null,
      lists: []
    }
  },
  created () {
  },
  mounted () {
    userService.findById(this.$route.params.userId).then(user => {
      this.$set(this, 'user', user)
    })
  },
  methods: {
  }
}
</script>

<style>
.user-firstName .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  display: inline-block;
  min-width: 600px;
}
.add-new-list .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  margin: 0;
}
</style>
