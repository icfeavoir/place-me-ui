<template>
    <div>
      <select class="dark lg" v-model="selected" :disabled="plans.length === 0">
        <option class="info-disabled" v-if="plans.length === 0" :value="-1" >Tous les plans sont déjà liés à cet événement</option>
        <option v-for="plan in plans" :key="plan._id" :value="plan.id">{{ plan.name }}</option>
      </select>
    </div>
</template>

<script>
import eventService from '@/services/event.service'

export default {
  name: 'EventAddPlan',
  props: {
    event: Object,
    data: Object
  },
  data () {
    return {
      plans: [],
      selected: -1
    }
  },
  mounted: function () {
    this.data = {}
    if (this.event) {
      const it = this
      eventService.getNoPlans(this.event.id).then(plans => {
        it.plans = plans
        if (plans[0]) {
          it.selected = plans[0].id
        }
      })
    }
  },
  watch: {
    selected: function (n, o) {
      this.$store.commit('setDataEventAddPlan', this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
