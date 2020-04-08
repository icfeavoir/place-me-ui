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
      <input v-focus type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <button @click="showModal = true" class="main-btn"><i class="fa fa-plus-circle"></i>Ajouter un plan à cet événement</button>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="plans && plans.length === 0">Aucun plan sur cet événement</p>
      <div class="plan" v-for='plan in plans' :key='plan.total'>
        <Card
          url="EventPlan"
          :params="{eventId: event.id, planId: plan.id}"
          :data="{
            title: plan.name,
            number: plan.total,
            desc: 'réservations sur ce plan pour ' + event.name,
            obj: plan
          }"
          @del='deletePlanFromEvent'
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventService from '@/services/event.service'

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
      allPlans: [],
      plans: null,
      event: null,

      search: '',
      showModal: false,
      dataEventAddPlan: null
    }
  },
  created: function () {
    let eventId = this.$route.params.eventId
    eventService.findById(eventId).then(e => {
      this.$set(this, 'event', e)
    })
    this.refreshPlans(eventId)
  },
  methods: {
    refreshPlans: function (eventId) {
      eventService.getPlans(eventId).then((data) => {
        let plans = []
        data.forEach(d => {
          plans.push(d.plan)
        })
        this.$set(this, 'allPlans', plans)
        this.$set(this, 'plans', plans)

        // quand on rafraichit les plan, on refait le comptage
        this.countBook(eventId)
      })
    },
    countBook: function (eventId) {
      eventService.countBook(eventId).then((data) => {
        data.forEach(element => {
          if (this.plans && element) {
            this.$set(this.plans.find(p => p.id === element.plan_id) || {}, 'total', element.total)
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
                it.$toasted.error(res.error)
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
          it.$toasted.error(res.error)
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
            this.$toasted.success('Le nom a été modifié !')
          }
        })
      }
    },

    doSearch: function () {
      this.plans = this.allPlans.filter((plan) => plan.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/home-list.scss';
</style>
