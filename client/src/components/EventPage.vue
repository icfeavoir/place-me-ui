<template>
  <div class='event-page-main'>
    <template v-if='event'>
      <div class='event-firstName'>
        <h2>{{ event.name }}</h2>
      </div>
    </template>
  </div>
</template>

<script>
import eventService from '../services/event.service'
export default {
  components: {

  },
  data () {
    return {
      event: null,
      lists: []
    }
  },
  created () {
  },
  mounted () {
    eventService.findById(this.$route.params.eventId).then(event => {
      this.$set(this, 'event', event)
    })
  },
  methods: {
  }
}
</script>

<style>
.event-firstName .is-editing {
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
