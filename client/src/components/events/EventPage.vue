<template>
  <div>

    <Modal v-if="showModal" @close-modal="showModal = false" @valid-modal="addPlan" title="Ajouter un plan">
      <EventAddPlan :event="event" :data="dataEventAddPlan" />
    </Modal>

    <div class="title">
      <input v-if="event" v-model="event.name" @change="update" />
    </div>
    <hr>
    <header>
      <input ref="search" type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <button @click="showModal = true" class="main-btn"><i class="fa fa-plus-circle"></i>Ajouter un plan à cet événement</button>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="eventPlans && eventPlans.length === 0">Aucun plan sur cet événement</p>
      <div class="plan" v-for='eventPlan in eventPlans' :key='eventPlan._id'>
        <Card
          url="EventPlan"
          :params="{eventPlanId: eventPlan.id}"
          :data="{
            title: eventPlan.plan.name,
            number: eventPlan.total || 0,
            desc: 'réservations sur ce plan pour ' + eventPlan.plan.name,
            obj: eventPlan.plan
          }"
          @del='deletePlanFromEvent'
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import groupService from '@/services/group.service'
import eventPlanService from '@/services/eventPlan.service'

import Card from '@/components/elem/Card'
import EventAddPlan from '@/components/events/EventAddPlan'
import Modal from '@/components/elem/Modal'

export default {
  name: 'Plans',
  components: {
    Card,
    EventAddPlan,
    Modal
  },
  data () {
    return {
      allEventPlans: [],
      eventPlans: null,
      event: null,

      search: '',
      showModal: false,
      dataEventAddPlan: null
    }
  },
  mounted () {
    let eventId = this.$route.params.eventId
    eventService.findById(eventId).then(e => {
      this.$set(this, 'event', e)
    })
    this.refreshPlans(eventId)

    if (this.isMobileAndTabletcheck() === false) {
      this.$refs.search.focus()
    }
  },
  methods: {
    refreshPlans: function (eventId) {
      eventPlanService.getByEventId(eventId).then((eventPlans) => {
        this.$set(this, 'allEventPlans', eventPlans)
        this.$set(this, 'eventPlans', eventPlans)
        // quand on rafraichit les plan, on refait le comptage
        this.countBook(eventId)
      })
    },
    countBook: function (eventId) {
      groupService.countGroupByEvent().then((data) => {
        data.forEach(element => {
          if (this.eventPlans && element && element['event_plan.event.id'] === this.event.id) {
            this.$set(this.eventPlans.find(p => p.plan.id === element['event_plan.plan.id']) || {}, 'total', element.total)
          }
        })
      })
    },

    deletePlanFromEvent: function (plan) {
      const planId = plan.id
      const eventId = this.event.id
      const it = this
      if (planId) {
        let msg = {
          title: 'Supprimer un plan',
          body: 'Voulez-vous supprimer le plan <b>' + plan.name + '</b> pour l\'événement <b>' + this.event.name + '</b> ?'
        }
        let options = {
          html: true,
          okText: 'Valider',
          cancelText: 'Fermer',
          backdropClose: true
        }
        this.$dialog
          .confirm(msg, options)
          .then(function (dialog) {
            eventService.deletePlan(eventId, planId).then(res => {
              if (res.success) {
                // suppr du plan pour cet event
                it.refreshPlans(eventId)
                it.$toasted.success('Plan supprimé de cet événement !')
              } else {
                it.$toasted.error(res.error, {icon: 'ban'})
              }
            })
          })
      }
    },

    addPlan: function () {
      let newPlan = this.$store.state.dataEventAddPlan
      let eventId = this.event.id
      const it = this
      eventService.addPlan(this.event.id, newPlan).then(res => {
        if (res.success) {
          it.$toasted.success('Plan ajouté !')
          it.showModal = false
          it.refreshPlans(eventId)
        } else {
          it.$toasted.error(res.error, {icon: 'ban'})
        }
      })
    },

    update: function () {
      if (this.event) {
        // UPDATE
        let data = {
          name: this.event.name,
          date: this.event.date
        }
        data.id = this.event.id
        eventService.update(data).then(res => {
          if (res.error) {
            this.error = res.error
            this.$toasted.error(res.error)
          } else {
            this.$toasted.success('Le nom a été modifié !', {icon: 'ban'})
          }
        })
      }
    },

    doSearch: function () {
      this.eventPlans = this.allEventPlans.filter((ep) => ep.plan.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/home-list.scss';
</style>
