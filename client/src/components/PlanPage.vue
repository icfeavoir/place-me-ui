<template>
  <div class='plan-page-main'>
    <template v-if='plan'>
      <div class='plan-name'>
        <h2>{{ plan.name }}</h2>
        {{ plan.width }} x {{ plan.height }}
      </div>
    </template>
  </div>
</template>

<script>
import planService from '../services/plan.service'
export default {
  components: {

  },
  data () {
    return {
      plan: null,
      lists: []
    }
  },
  created () {
  },
  mounted () {
    planService.findById(this.$route.params.planId).then(plan => {
      this.$set(this, 'plan', plan)
    })
  },
  methods: {
  }
}
</script>

<style>
.plan-firstName .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  display: inline-block;
  min-width: 600px;
}
.add-new-list .is-editing {
  background-color: #ffffff;
  color: #000000;
  padding: 8px;
  margin: 0;
}
</style>
