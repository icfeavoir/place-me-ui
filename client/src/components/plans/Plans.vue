<template>
  <div class='plans'>
    <router-link v-for='plan in plans' class='plan' :key='plan._id' :to='{name: "PlanPage", params: {planId: plan.id}}'>
      {{ plan.name }}
    </router-link>
  </div>
</template>

<script>
import planService from '@/services/plan.service'
export default {
  name: 'Plans',
  data () {
    return {
      plans: []
    }
  },
  mounted () {
    planService.getAll()
      .then((plans) => {
        this.$set(this, 'plans', plans)
      })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.plans {
  width: 80%;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  flex-wrap: wrap;
}
.plan {
  border-radius: 3px;
  color: #FFFFFF;
  display: block;
  text-decoration: none;
  width: 15%;
  min-width: 150px;
  min-height: 80px;
  padding: 10px;
  background-color: rgb(0, 121, 191);
  margin: 0 15px 15px 0;
}
</style>
