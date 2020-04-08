<template>
  <div>
    <header>
      <input v-focus type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <router-link :to='{name: "PlanAdd"}'><button class="main-btn"><i class="fa fa-plus-circle"></i>Nouveau plan</button></router-link>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="plans && plans.length === 0">Aucun plan</p>
      <div class="plan" v-for='plan in plans' :key='plan.total'>
        <Card
          url="PlanPage"
          :params="{planId: plan.id}"
          :data="{
            title: plan.name,
            number: plan.total,
            desc: '',
            obj: plan
          }"
          @del='deletePlan'
        />
      </div>
    </div>
  </div>
</template>

<script>
import planService from '@/services/plan.service'

import Card from '@/components/elem/Card'

export default {
  name: 'Plans',
  components: {
    Card
  },
  data () {
    return {
      allPlans: [],
      plans: null,

      search: ''
    }
  },
  created: function () {
    planService.getAll()
      .then((plans) => {
        this.$set(this, 'allPlans', plans)
        this.$set(this, 'plans', plans)
      })

    planService.countSeats()
      .then((data) => {
        data.forEach(element => {
          this.$set(this.plans.find(p => p.id === element.id) || {}, 'total', element.total)
        })
      })
  },
  mounted () {
  },
  methods: {
    deletePlan: function (plan) {
      const id = plan.id
      const it = this
      if (id) {
        let msg = {
          title: 'Supprimer un plan',
          body: 'Voulez-vous supprimer le plan ' + plan.name + ' ?'
        }
        let options = {
          okText: 'Valider',
          cancelText: 'Fermer',
          backdropClose: true
        }
        this.$dialog
          .confirm(msg, options)
          .then(function (dialog) {
            planService.delete(id).then(res => {
              if (res.success) {
                // remove from plans
                it.plans = it.plans.filter((plan) => {
                  return plan.id !== id
                })
                it.$toasted.success('Supprimé !')
              }
            })
          })
          .catch(function () {})
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
