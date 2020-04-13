// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSidebarMenu from 'vue-sidebar-menu'
import VuejsDialog from 'vuejs-dialog'
import Toasted from 'vue-toasted'
import Vuex from 'vuex'
import VueDragDrop from 'vue-drag-drop'
import VTooltip from 'v-tooltip'

// Style
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

// mixins
import { utils } from '@/components/mixins/utils'

import socketService from './services/socket.service'
socketService.connect()

Vue.config.productionTip = false
Vue.config.silent = true

Vue.use(VueSidebarMenu)
Vue.use(VuejsDialog)
Vue.use(Toasted, {position: 'bottom-center', duration: 4000, iconPack: 'fontawesome', icon: 'check', theme: 'outline'})
Vue.use(Vuex)
Vue.use(VueDragDrop)
Vue.use(VTooltip)

// mixin
Vue.mixin(utils)

const store = new Vuex.Store({
  state: {
    dataEventAddPlan: null
  },
  mutations: {
    setDataEventAddPlan (state, data) {
      state.dataEventAddPlan = data
    }
  }
})

// directives
Vue.directive('focus', {
  // Enregistrer une directive globale appelée `v-focus`
  // Quand l'élément lié est inséré dans le DOM...
  inserted: function (el) {
    // L'élément prend le focus
    el.focus()
  }
})

axios.defaults.baseURL = process.env.SERVER_API

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
