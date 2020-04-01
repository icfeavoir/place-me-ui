// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSidebarMenu from 'vue-sidebar-menu'
import VuejsDialog from 'vuejs-dialog'

// Style
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

import socketService from './services/socket.service'
socketService.connect()

Vue.config.productionTip = false
Vue.config.silent = true

Vue.use(VueKonva)
Vue.use(VueSidebarMenu)
Vue.use(VuejsDialog)

axios.defaults.baseURL = 'http://localhost:3000'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
