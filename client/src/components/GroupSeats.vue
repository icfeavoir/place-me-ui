<template>
  <div class='groupSeats'>
    <router-link v-for='groupSeat in groupSeats' class='groupSeat' :key='groupSeat._id' :to='{name: "ReservationPage", params: {groupSeatId: groupSeat.id}}'>
      {{ groupSeat.name }}
    </router-link>
  </div>
</template>

<script>
import groupSeatService from '../services/groupSeat.service'
export default {
  name: 'Events',
  data () {
    return {
      groupSeats: []
    }
  },
  mounted () {
    groupSeatService.getAll()
      .then((groupSeats) => {
        this.$set(this, 'groupSeats', groupSeats)
      })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.groupSeats {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.groupSeat {
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
