<template>
  <div class="event-plan-container">
    <GroupList ref="groupList" class="group-list" v-if="groups" :groups="groups" @select-group="selectGroup" @drag-start="groupDragStart" />
    <div class="plan-container">
      <div class="event-plan-header" v-if="event">
        <router-link :to="{name: 'EventPage', params: {eventId: event.id}}"><button class="btn-lg"><i class="fa fa-arrow-left"></i> Retour à <b>{{ event.name }}</b></button></router-link>
        <button @click="autoFill">AUTO FILL</button>
        <p class="saved" :style="savedStyle">
          <i v-if="isSaved" class="fa fa-check"></i>
          <i v-else class="fa fa-spinner fa-spin"></i>
          {{ savedText }}
        </p>
      </div>
      <Plan
        ref="plan"
        class="plan"
        v-if="plan"
        :plan="plan"
        @group-changed="groupChanged"
        @select-seat="selectSeat"
        @save="saveGroups"
      />
    </div>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import planService from '@/services/plan.service'
import forbiddenSeatService from '@/services/forbiddenSeat.service'
import groupService from '@/services/group.service'
import groupSeatService from '@/services/groupSeat.service'

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
      groups: null,
      isSaved: true,
      isSaving: false
    }
  },
  mounted () {
    let eventId = this.$route.params.eventId
    let planId = this.$route.params.planId
    eventService.findById(eventId).then(e => {
      this.$set(this, 'event', e)
    })
    let promises = [planService.findById(planId), groupService.getByEventPlan(eventId, planId)]
    Promise.all(promises).then(results => {
      let plan = results[0]
      let groups = results[1]
      this.$set(this, 'groups', groups)
      forbiddenSeatService.findByPlanId(plan.id).then(f => {
        plan.forbiddenSeats = f
        this.$set(this, 'plan', plan)
        // on place les gens avec les infos de la DB
        groupSeatService.getByEventPlan(eventId, planId).then(groupSeats => {
          groupSeats.forEach(gs => {
            if (gs.group_id) {
              let seat = this.$refs.plan.findSeat(gs.line, gs.cell)
              let group = this.$refs.groupList.getGroupById(gs.group_id)
              this.$refs.plan.placeGroup({
                setSeat: true, // mode simple
                group: group,
                seat: seat
              }, false) // on sauve pas ce qu'on vient de recup
            }
          })
        })
      })
    })
  },
  methods: {
    groupChanged: function (data) {
      // permet de recalculer les groups
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
    saveGroups () {
      // on save que si on est pas déjà en train de save
      if (!this.isSaving) {
        this.isSaved = false
        this.isSaving = true
        // on attend un peu que toutes les modifs soient prises en compte
        setTimeout(() => {
          this.sendToServer().then(res => {
            this.isSaving = false
            if (res.success) {
              this.isSaved = true
            }
          })
        }, 250)
      } else {
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
    },

    sendToServer () {
      let data = {
        event_id: this.event.id,
        plan_id: this.plan.id,
        groups: []
      }
      this.$refs.plan.seats.forEach(seat => {
        let obj = {
          group_id: seat.isEmpty ? null : seat.group.id,
          line: seat.line,
          cell: seat.cell
        }
        data.groups.push(obj)
      })
      return groupSeatService.setGroupSeat(data)
    },

    autoFill () {
      let shouldContinue = true
      while (shouldContinue) {
        let group = this.$refs.groupList.getSelectedGroup() || null
        if (group === null) {
          let groupsRemaining = this.$refs.groupList.groups.filter(g => g.remaining !== 0)
          if (groupsRemaining.length > 0) {
            group = groupsRemaining[0]
            this.$refs.groupList.select(group.id)
          }
        }

        if (group) {
          let emptySeats = this.$refs.plan.getEmptySeats()
          if (emptySeats.length > 0) {
            let seat = emptySeats[0]
            this.selectSeat(seat)
          } else {
            shouldContinue = false
          }
        } else {
          shouldContinue = false
        }
      }
    }
  },
  computed: {
    savedStyle () {
      return {
        color: this.isSaved ? this.colors.mainGreen : this.colors.bgColor,
        border: this.isSaved ? '1px solid ' + this.colors.mainGreen : 'none'
      }
    },
    savedText () {
      return this.isSaved ? 'Sauvegardé' : 'Sauvegarde...'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/event-plan.scss';
</style>