<template>
  <div id='app'>
    <Menu />
    <div class="main"><router-view/></div>
  </div>
</template>

<script>
import Menu from './components/Menu'
export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
Menu {
  width: 15%;
  display: inline-block;
}

.main {
  width: 84%;
  display: inline-block;
}
</style>
