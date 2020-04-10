<template>
  <div>
    <Modal
      v-if="showModalShortcuts"
      @close-modal="showModalShortcuts = false"
      :modal-style="modalShortcutsStyle"
      :validateBtn="false"
      title="Infos"
    ><Shortcuts /></Modal>

    <div class="event-plan-container">
      <GroupList
        ref="groupList"
        class="group-list"
        v-if="groups"
        :groups="groups"
        @select-group="selectGroup"
        @drag-start="groupDragStart"
        @group-changed="groupSeatChanged"
        @group-line-changed="groupLineChanged"
      />

      <div class="plan-container">
        <div class="event-plan-header" v-if="event">
          <router-link :to="{name: 'EventPage', params: {eventId: event.id}}">
            <button class="main-btn allow-small"><i class="fa fa-arrow-left"></i><a v-if="isLargeScreen">Retour à <b>{{ event.name }}</b></a></button>
          </router-link>
          <button class="main-btn allow-small" @click="generate">
            <i class="fa fa-running"></i><a v-if="isLargeScreen">Générer</a>
          </button>
          <p class="saved allow-small" :style="savedStyle">
            <i v-if="isSaved" class="i-only-center fa fa-check fa-sm"></i>
            <i v-else class="i-only-center fa fa-spinner fa-spin fa-sm"></i>
            <a v-if="isLargeScreen">{{ savedText }}</a>
          </p>
          <button class="main-btn little-info-btn allow-small" @click="showModalShortcuts = true"><i class="i-only-center fa fa-info"></i></button>
          <button v-if="this.isMobileAndTabletcheck()" class="main-btn suppr-groups" @click="supprSelectedGroups">
            <i class="fa fa-trash-alt"></i><a>Suppr</a>
          </button>
        </div>
        <Plan
          ref="plan"
          class="plan"
          v-if="plan"
          :plan="plan"
          @group-changed="groupSeatChanged"
          @select-seat="selectSeat"
          @save="saveGroups"
        />
      </div>
    </div>
  </div>
</template>

<script>
import forbiddenSeatService from '@/services/forbiddenSeat.service'
import groupService from '@/services/group.service'
import groupSeatService from '@/services/groupSeat.service'
import eventPlanService from '@/services/eventPlan.service'

import GroupList from '@/components/elem/GroupList'
import Plan from '@/components/elem/Plan'
import Modal from '@/components/elem/Modal'
import Shortcuts from '@/components/elem/Shortcuts'

export default {
  components: {
    GroupList,
    Plan,
    Modal,
    Shortcuts
  },
  data () {
    return {
      eventPlanId: null,
      event: null,
      plan: null,
      groups: null,
      isSaved: true,
      isSaving: false,
      isLargeScreen: false,
      // modal shortcuts
      showModalShortcuts: false,
      modalShortcutsStyle: {
        width: '80%',
        marginTop: 20
      }
    }
  },
  created () {
    window.addEventListener('resize', this.resize)
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  mounted () {
    let eventPlanId = this.$route.params.eventPlanId
    this.eventPlanId = eventPlanId
    eventPlanService.findById(eventPlanId).then(eventPlan => {
      // l'event
      this.$set(this, 'event', eventPlan.event)

      // le plan
      let plan = eventPlan.plan
      forbiddenSeatService.findByPlanId(plan.id).then(forbiddenSeats => {
        plan.forbiddenSeats = forbiddenSeats || []
        this.$set(this, 'plan', plan)
      })

      // les groupes
      groupService.getByEventPlanId(eventPlanId).then(groups => {
        this.$set(this, 'groups', groups)
        // on place les gens avec les infos de la DB
        this.setGroupSeats(eventPlanId)
      })
    })

    this.isLargeScreen = !this.isPortraitView() && !this.isSmallWidthScreen()
  },
  methods: {
    setGroupSeats (eventPlanId, groupId = null) {
      let request = groupId ? groupSeatService.getByEventPlanIdAndGroupId(eventPlanId, groupId) : groupSeatService.getByEventPlanId(eventPlanId)
      if (groupId) {
        // on enlève les places du groupes avant de les remettre
        this.$refs.plan.placeGroup({
          delGroup: true,
          groupId: groupId
        }, false)
      }
      request.then(groupSeats => {
        // on met les groupes sur les sièges
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
    },

    groupLineChanged (group) { // appelée UNE FOIS quand on bouge un groupe
      this.$refs.plan.checkGroupErrors(group)
    },
    groupSeatChanged: function (data) { // appelée pour CHAQUE siège qui change
      // permet de recalculer les groups
      let group = data.group
      let realGroup = this.groups.find(g => g.id === group.id) // l'obj group
      if (realGroup) {
        if (data.refreshPlan) {
          this.setGroupSeats(this.eventPlanId, realGroup.id)
        }
        if (data.changeEventPlan) {
          // le groupe est changé d'event plan, on l'enlève de la liste
          this.$refs.groupList.removeGroup(realGroup.id)
        } else {
          // on remet à jour les compteurs
          let count = data.count || 0
          let done = realGroup.done ? realGroup.done + count : count
          this.$set(this.groups.find(g => g.id === group.id), 'done', done)
          let remaining = realGroup.number - realGroup.done
          this.$set(this.groups.find(g => g.id === group.id), 'remaining', remaining)
        }
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

    selectSeat (seat, fromGenerate = false) {
      // quand on clique sur un siège, on check si on a un groupe de select
      let group = this.$refs.groupList.getSelectedGroup()
      if (group) {
        // uniquement si seat select est différent du group
        if (!(seat.group && seat.group.id === group.id)) {
          this.$refs.plan.placeGroup({
            auto: true, // mode auto
            group: group,
            seat: seat,
            allowChangeLine: fromGenerate
          })
          this.$refs.plan.unselectAll()
          // si le groupe est vidé on l'unselect
          if (group.remaining === 0) {
            this.$refs.groupList.unselect()
          }
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

    generate () {
      let shouldContinue = true
      while (shouldContinue) {
        let group = this.$refs.groupList.getSelectedGroup() || null
        if (group === null) {
          let groupsRemaining = this.$refs.groupList.groups.filter(g => g.remaining !== 0)
          // on range par remaining DECROISSANT
          groupsRemaining.sort((a, b) => {
            if (a.remaining < b.remaining) {
              return 1
            } else if (a.remaining > b.remaining) {
              return -1
            } else {
              return 0
            }
          })
          if (groupsRemaining.length > 0) {
            group = groupsRemaining[0]
            this.$refs.groupList.select(group.id)
          }
        }

        if (group) {
          let emptySeats = this.$refs.plan.getEmptySeats()
          if (emptySeats.length > 0) {
            let seat = emptySeats[0]
            this.selectSeat(seat, true) // fromGenerate = true
          } else {
            shouldContinue = false
          }
        } else {
          shouldContinue = false
        }
      }
    },
    supprSelectedGroups () {
      let deleted = this.$refs.plan.supprSelectedGroups()
      if (deleted === 0) {
        this.$toasted.info('Aucun siège sélectionné')
      }
    },

    resize () {
      this.isLargeScreen = !this.isPortraitView() && !this.isSmallWidthScreen()
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
