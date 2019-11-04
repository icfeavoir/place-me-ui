<template>
  <nav>
    <ul>
        <li><router-link to="/">Reservations</router-link></li>
        <li><router-link to="/events">Events</router-link></li>
        <li><router-link to="/plans">Plans</router-link></li>
    </ul>
</nav>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$mainColor:#b35757;
nav {
    width: 15%;
    background-color: $mainColor;
    height:100%;
    ul {
        list-style-type:none;
        position:relative;
    }
    li {
        font-size:2em;
        margin:10px auto;
        padding-left: 5px;
        color:white;
        margin-bottom: 25px;
    }
}
</style>
