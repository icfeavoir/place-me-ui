<template>
  <div class='groupSeat-page-main'>
    <template v-if='groupSeat'>
      <div class='groupSeat-firstName'>
        <h2>{{ groupSeat.name }}</h2>
      </div>
    </template>
  </div>
</template>

<script>
import groupSeatService from '@/services/groupSeat.service'
export default {
  components: {

  },
  data () {
    return {
      groupSeat: null,
      lists: []
    }
  },
  created () {
  },
  mounted () {
    groupSeatService.findById(this.$route.params.groupSeatId).then(groupSeat => {
      this.$set(this, 'groupSeat', groupSeat)
    })
  },
  methods: {
  }
}
</script>

<style>
.groupSeat-firstName .is-editing {
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
