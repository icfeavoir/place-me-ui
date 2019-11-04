<template>
  <div class='events'>
    <router-link v-for='event in events' class='event' :key='event._id' :to='{name: "EventPage", params: {eventId: event.id}}'>
      {{ event.name }}
    </router-link>
  </div>
</template>

<script>
import eventService from '../services/event.service'
export default {
  name: 'Events',
  data () {
    return {
      events: []
    }
  },
  mounted () {
    eventService.getAll()
      .then((events) => {
        this.$set(this, 'events', events)
      })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.events {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.event {
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
