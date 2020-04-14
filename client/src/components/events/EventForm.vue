<template>
  <div class="form" @keydown.esc="init">
    <h2 class="form-title">{{ this.event ? name : 'Nouvel événement'}}</h2>
    <form class="add-form" @keydown.enter="submit">
      <input v-focus id="name" @change="upperFirst" v-model="name" placeholder="Nom de l'événement">
      <input id="date" type="date" v-model="date" placeholder="Date" />
      <div class="submit-container">
        <PrettyButton :allowSmall="false" class="square more-padding center margin" @click="submit" >{{ group ? 'Modifier l\'évènement' : 'Enregistrer' }}</PrettyButton>
        <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
      </div>
    </form>
  </div>
</template>

<script>
import eventService from '@/services/event.service'

import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'EventForm',
  components: {
    PrettyButton
  },
  props: {
    event: Object
  },
  data () {
    return {
      name: '',
      date: null,

      error: ''
    }
  },
  watch: {
    event: function (newEvent, oldEvent) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      let data = {
        name: this.name,
        date: this.date
      }

      if (this.event) {
        // UPDATE
        data.id = this.event.id
        eventService.update(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Modifié !')
          }
        })
      } else {
        // NEW
        eventService.create(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Enregistré !')
            this.init()
          }
        })
      }
    },

    init: function () {
      let group = this.event || {}

      this.name = group.name || ''
      this.date = group.date || ''
      this.error = ''
    },

    upperFirst: function () {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
<style lang="scss" scoped>
  @import '@/scss/add-form.scss';
</style>
