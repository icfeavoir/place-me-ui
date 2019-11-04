<template>
  <div class='group-page-main'>
    <template v-if='group'>
      <div class='group-name'>
        <h2>{{ group.name }}</h2>
      </div>
    </template>
  </div>
</template>

<script>
import groupService from '../services/group.service'
export default {
  components: {

  },
  data () {
    return {
      group: null,
      lists: []
    }
  },
  created () {
  },
  mounted () {
    groupService.findById(this.$route.params.groupId).then(group => {
      this.$set(this, 'group', group)
    })
  },
  methods: {
  }
}
</script>

<style>
.group-firstName .is-editing {
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
