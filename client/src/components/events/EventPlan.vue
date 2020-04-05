<template>
  <div class="event-plan-container">
    <GroupList ref="groupList" class="group-list" v-if="groups" :groups="groups" @select-group="selectGroup" />
    <Plan ref="plan" class="plan" v-if="plan" :plan="plan" @group-changed="groupChanged" @select-seat="selectSeat" />
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'
import forbiddenSeatService from '@/services/forbiddenSeat.service'
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
      forbiddenSeatService.findByPlanId(p.id).then(f => {
        p.forbiddenSeats = f
        this.$set(this, 'plan', p)
      })
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
    },

    selectSeat (seat) {
      // quand on clique sur un siège, on check si on a un groupe de select
      let group = this.$refs.groupList.getSelectedGroup()
      if (group) {
        this.$refs.plan.placeGroup({
          auto: true, // mode auto
          group: group,
          seat: seat
        })
        this.$refs.plan.unselectAll()
        // si le groupe est vidé on l'unselect
        if (group.remaining === 0) {
          this.$refs.groupList.unselect()
        }
      }
    },

    selectGroup (group) {
      // quand on clique sur un group, on check si on a des sièges de select
      if (group) {
        this.$refs.plan.getSelectedSeats().forEach(seat => {
          this.$refs.plan.placeGroup({
            setSeat: true, // mode simple
            group: group,
            seat: seat
          })
          this.$refs.plan.unselectAll()
          this.$refs.groupList.unselect()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/event-plan.scss';
</style>
