<template>
  <div class="form" @keydown.esc="init">
    <h2 class="form-title">{{ this.plan ? name : 'Nouveau plan'}}</h2>
     <form class="add-form" @keydown.enter="submit">
        <input v-focus id="name" @change="upperFirst" v-model="name" placeholder="Nom du plan">

        <div class="form-lg-container">
          <input class="md" id="line" type="number" min="0" v-model="line" placeholder="Nombre de lignes" />
          <input class="md" id="cell" type="number" min="0" v-model="cell" placeholder="Nombre de sièges par ligne" />
        </div>

        <div class="submit-container">
          <PrettyButton :allowSmall="false" class="square more-padding center margin" @click="submit" >{{ group ? 'Modifier le plan' : 'Enregistrer' }}</PrettyButton>
          <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
        </div>
    </form>
  </div>
</template>

<script>
import planService from '@/services/plan.service'

import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'PlanForm',
  components: {
    PrettyButton
  },
  props: {
    plan: Object
  },
  data () {
    return {
      name: '',
      line: null,
      cell: null,

      error: ''
    }
  },
  watch: {
    plan: function (newPlan, oldPlan) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      var data = {
        name: this.name,
        line: this.line,
        cell: this.cell
      }

      if (this.plan) {
        // UPDATE
        data.id = this.plan.id
        planService.update(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Modifié !')
          }
        })
      } else {
        // NEW
        planService.create(data).then(res => {
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
      let plan = this.plan || {}

      this.name = plan.name || ''
      this.line = plan.line || null
      this.cell = plan.cell || null

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
<style lang="scss" scoped>
  input.name {
    width: 90%;
  }
</style>
