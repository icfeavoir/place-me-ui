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
        :eventId="event ? event.id : null"
        :planId="plan ? plan.id : null"
        @select-group="selectGroup"
        @drag-start="groupDragStart"
        @group-changed="groupSeatChanged"
        @new-group="newGroup"
      />

      <div class="plan-container">
        <div class="event-plan-header" v-if="event">
          <router-link :to="{name: 'EventPage', params: {eventId: event.id}}">
            <PrettyButton icon="arrow-left">Retour à <b>{{ event.name }}</b></PrettyButton>
          </router-link>
          <PrettyButton icon="running" @click="generate">Remplir</PrettyButton>
          <SaverInfo :isSaved="isSaved" />
          <PrettyButton class="tiny-btn no-margin" icon="info" @click="showModalShortcuts = true"></PrettyButton>
          <PrettyButton v-if="isMobileAndTabletcheck()" :allowSmall="false" class="suppr-groups" icon="trash-alt" @click="supprSelectedGroups">Suppr.</PrettyButton>
        </div>

        <Plan
          ref="plan"
          class="plan"
          v-if="plan"
          :plan="plan"
          @group-changed="groupSeatChanged"
          @select-seat="selectSeat"
          @groups-changed="checkGroupsErrors"
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
import constraintService from '@/services/constraint.service'

import GroupList from '@/components/elem/GroupList'
import Plan from '@/components/elem/Plan'
import SaverInfo from '@/components/elem/SaverInfo'
import PrettyButton from '@/components/elem/PrettyButton'
import Modal from '@/components/elem/Modal'
import Shortcuts from '@/components/elem/Shortcuts'

export default {
  components: {
    GroupList,
    Plan,
    SaverInfo,
    PrettyButton,
    Modal,
    Shortcuts
  },
  data () {
    return {
      eventPlanId: null,
      event: null,
      plan: null,
      groups: null,
      allConstraints: [],
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

      // les contraintes
      constraintService.getByPlan(plan.id).then(constraintSeats => this.$set(this, 'allConstraints', constraintSeats))
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
          this.$set(this.groups.find(g => g.id === group.id), 'done', realGroup.done ? realGroup.done + count : count)
          this.$set(this.groups.find(g => g.id === group.id), 'remaining', realGroup.number - realGroup.done)
        }
      }
    },
    newGroup (group) {
      let newGroup = group.data
      // VALEURS PAR DÉFAUT
      newGroup.isVisible = true
      newGroup.done = 0
      newGroup.remaining = newGroup.number
      this.groups.push(newGroup)
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
            this.$refs.groupList.selectNext()
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
        this.$toasted.info('Aucun siège sélectionné', {icon: 'ban'})
      }
    },

    resize () {
      this.isLargeScreen = !this.isPortraitView() && !this.isSmallWidthScreen()
    },

    /**
     * CHEKING ERRORS
     */
    checkGroupsErrors (groupIds) {
      groupIds.forEach(id => {
        let group = this.groups.find(g => g.id === id)
        this.checkGroupAlone(group)
        this.checkGroupConstraints(group)
      })
    },
    checkGroupAlone (group) {
      if (group) {
        // on prend chaque place de ce groupe
        this.$refs.plan.getGroupSeats(group.id).forEach(seat => {
          let isolated = this.isSeatIsolated(seat)
          seat.isIsolated = isolated
        })
      }
    },
    isSeatIsolated (seat) { // prend un siège et regarde autour de lui
      if (seat.group.number === 1) {
        // le group est une seule personne, normal qu'il soit seul
        return false
      } else {
        let toTest = [
          {line: seat.line, cell: seat.cell - 1}, // à gauche
          {line: seat.line, cell: seat.cell + 1} // à droite
        ]
        for (let i = 0; i < toTest.length; i++) {
          let data = toTest[i]
          let seatTested = this.$refs.plan.findSeat(data.line, data.cell)
          if (seatTested && seatTested.group && seatTested.group.id === seat.group.id) {
            return false
          }
        }
      }
      // on a pas trouvé de gens autour
      return true
    },
    checkGroupConstraints (group) {
      if (group && group.constraint) {
        // on prend chaque place de ce groupe
        const forAll = group.constraint_number === group.number
        const constraintSeats = this.allConstraints.filter(cs => cs.constraint_id === group.constraint_id)
        let seatsInError = []
        let count = 0
        this.$refs.plan.getGroupSeats(group.id).forEach(seat => {
          let respect = this.isSeatRespectingConstraint(seat, constraintSeats)
          if (respect) {
            count++
            if (seat.constraint) {
              // si une erreur était enregistrée, on l'annule
              seat.constraint.isRespected = true
              seat.constraint.text = ''
            }
          } else {
            seatsInError.push(seat)
          }
        })
        // on met à jour les seats in error
        seatsInError.forEach(seat => {
          // d'abord on vérifie l'objet constrainte
          if (seat.constraint === null) {
            seat.constraint = {}
          }
          let isOk = forAll ? false : count >= group.constraint_number
          // si le seat est en error mais que la constrainte est respéctée (count enough)
          if (isOk) {
            // on annule la constrainte
            seat.constraint = null
          } else {
            // on met la contrainte
            seat.constraint.isRespected = false
            seat.constraint.text = forAll
              ? 'Le groupe <b>' + group.name + '</b> doit être en place <b>' + group.constraint_name + '</b>'
              : 'Le groupe <b>' + group.name + '</b> doit avoir au moins ' + group.constraint_number + ' personnes en place <b>' + group.constraint_name + '</b>'
          }
        })
      }
    },
    isSeatRespectingConstraint (seat, constraintSeats) {
      // on regarde si le siège fait partie des sièges de la contrainte
      for (let i = 0; i < constraintSeats.length; i++) { // boucle pour break en faisant return
        let cSeat = constraintSeats[i]
        if (cSeat.line === seat.line && cSeat.cell === seat.cell) {
          return true
        }
      }
      return false
    }

  },
  computed: {
  },

  beforeRouteLeave (to, from, next) {
    if (!this.isSaved) {
      this.$toasted.error('Enregistrement en cours...', {icon: 'ban', duration: 1000})
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/event-plan.scss';
</style>
