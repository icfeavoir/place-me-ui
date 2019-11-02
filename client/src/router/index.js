import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/Users'
import User from '@/components/UserPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Users',
      component: Users
    },
    {
      path: '/users/:userId',
      name: 'UserPage',
      component: User
    }
  ]
})
