import Vue from 'vue'
import Router from 'vue-router'

import Groups from '@/components/groups/Groups'
import Group from '@/components/groups/GroupPage'
import GroupForm from '@/components/groups/GroupForm'

import Events from '@/components/events/Events'
import Event from '@/components/events/EventPage'
import EventForm from '@/components/events/EventForm'
import EventPlan from '@/components/events/EventPlan'

import Plans from '@/components/plans/Plans'
import Plan from '@/components/plans/PlanPage'
import PlanForm from '@/components/plans/PlanForm'

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
      path: '/groupsAdd/',
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
      path: '/eventsAdd/',
      name: 'EventAdd',
      component: EventForm
    },
    {
      path: '/eventsPlanAdd/',
      name: 'EventPlanAdd',
      component: EventForm
    },
    {
      path: '/eventsPlan/:eventPlanId',
      name: 'EventPlan',
      component: EventPlan
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
    },
    {
      path: '/plansAdd/',
      name: 'PlanAdd',
      component: PlanForm
    }
  ]
})
