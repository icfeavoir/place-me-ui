<template>
  <div>
    <header>
      <input ref="search" type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <router-link :to='{name: "EventAdd"}'><PrettyButton :allowSmall="false" icon="plus-circle">Nouvel événement</PrettyButton></router-link>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="events && events.length === 0">Aucun événement</p>
      <div class="event" v-for='event in events' :key='event.total'>
        <Card
          url="EventPage"
          :params="{eventId: event.id}"
          :data="{
            title: event.name,
            number: event.total || 0,
            desc: 'réservations',
            obj: event
          }"
          @del='del'
        />
      </div>
    </div>
  </div>
</template>

<script>
import eventService from '@/services/event.service'
import groupService from '@/services/group.service'

import Card from '@/components/elem/Card'
import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'Events',
  components: {
    Card,
    PrettyButton
  },
  data () {
    return {
      allEvents: [],
      events: null,

      search: ''
    }
  },
  mounted () {
    eventService.getAll().then((events) => {
      this.$set(this, 'allEvents', events)
      this.$set(this, 'events', events)

      groupService.countGroupByEvent().then((data) => {
        data.forEach(element => {
          if (element) {
            let prevTotal = this.events.find(e => e.id === element['eventPlan.event.id']).total || 0
            let sum = parseInt(prevTotal) + parseInt(element.total)
            this.$set(this.events.find(e => e.id === element['eventPlan.event.id']) || {}, 'total', sum)
          }
        })
      })
    })

    if (this.isMobileAndTabletcheck() === false) {
      this.$refs.search.focus()
    }
  },
  methods: {
    del: function (event) {
      const id = event.id
      const it = this
      if (id) {
        let msg = {
          title: 'Supprimer un événément',
          body: 'Voulez-vous supprimer l\'événément ' + event.name + ' ?'
        }
        let options = {
          okText: 'Valider',
          cancelText: 'Fermer',
          backdropClose: true
        }
        this.$dialog
          .confirm(msg, options)
          .then(function (dialog) {
            eventService.delete(id).then(res => {
              if (res.success) {
                // remove from events
                it.events = it.events.filter((event) => {
                  return event.id !== id
                })
                it.$toasted.success('Supprimé !')
              } else {
                it.$toasted.error('Error', {icon: 'ban'})
              }
            })
          })
          .catch(function () {})
      }
    },

    doSearch: function () {
      this.events = this.allEvents.filter((event) => event.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/home-list.scss';
</style>
