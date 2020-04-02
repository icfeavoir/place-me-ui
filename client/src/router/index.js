import Vue from 'vue'
import Router from 'vue-router'

import Groups from '@/components/Groups'
import Group from '@/components/GroupPage'
import GroupForm from '@/components/GroupForm'

import Events from '@/components/Events'
import Event from '@/components/EventPage'

import Plans from '@/components/Plans'
import Plan from '@/components/PlanPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Groups',
      component: Groups
    },
    {
      path: '/groups/:groupId',
      name: 'GroupPage',
      component: Group
    },
    {
      path: '/groups_add/',
      name: 'GroupAdd',
      component: GroupForm
    },

    {
      path: '/events',
      name: 'Events',
      component: Events
    },
    {
      path: '/events/:eventId',
      name: 'EventPage',
      component: Event
    },

    {
      path: '/plans',
      name: 'Plans',
      component: Plans
    },
    {
      path: '/plans/:planId',
      name: 'PlanPage',
      component: Plan
    }
  ]
})
