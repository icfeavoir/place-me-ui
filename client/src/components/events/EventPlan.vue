<template>
  <div class="event-plan-container">
    <GroupList class="group-list" v-if="groups" :groups="groups" />
    <Plan class="plan" v-if="plan" :plan="plan" @group-changed="groupChanged" />
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'
import groupService from '@/services/group.service'

import GroupList from '@/components/elem/GroupList'
import Plan from '@/components/elem/Plan'

export default {
  components: {
    GroupList,
    Plan
  },
  data () {
    return {
      event: null,
      plan: null,
      groups: null
    }
  },
  mounted () {
    let eventId = this.$route.params.eventId
    let planId = this.$route.params.planId
    eventService.findById(eventId).then(e => {
      this.$set(this, 'event', e)
    })
    planService.findById(planId).then(p => {
      this.$set(this, 'plan', p)
    })
    groupService.getByEventPlan(eventId, planId).then(groups => {
      this.$set(this, 'groups', groups)
    })
  },
  methods: {
    groupChanged: function (data) {
      let group = data.group
      let count = data.count

      let realGroup = this.groups.find(g => g.id === group.id)
      if (realGroup) {
        let done = realGroup.done ? realGroup.done + count : count
        this.$set(this.groups.find(g => g.id === group.id), 'done', done)
        let remaining = realGroup.number - realGroup.done
        this.$set(this.groups.find(g => g.id === group.id), 'remaining', remaining)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/event-plan.scss';
</style>
