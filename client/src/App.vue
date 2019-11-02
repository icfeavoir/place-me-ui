<template>
  <div id='app'>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html {
  box-sizing: border-box;
  font-size: 62.5%;
}
body {
  margin: 0;
}
html, body, #app {
  height: 100%;
}
body {
  background-color: #4fc08d;
  font-size: 1.6rem;
  font-family: Helvetica Neue,Arial,Helvetica,sans-serif;
  line-height: 20px;
}
*, *:before, *:after {
  box-sizing: inherit;
}
</style>
