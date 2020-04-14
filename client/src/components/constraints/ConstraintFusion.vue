<template>
  <div class="form" @keydown.esc="init" :class="dark ? 'dark' : 'light'">
    <h2 class="form-title">Fusionner avec {{ this.constraint ? name : ''}}</h2>
    <form class="add-form" @keydown.enter="submit">
        <p>Vous pouvez fusionner les contraintes si 2 contraintes identiques existent avec des noms différents (par exemple "Premier rang" et "1er rang"</p>
        <select id="constraint" v-model.number="constraint">
            <option v-for="(item, key) in constraints" v-bind:key="key" :value="item.id">{{item.name}}</option>
        </select>
        <div class="submit-container">
          <PrettyButton :allowSmall="false" class="square more-padding center margin light" @click="submit" >Fusionner</PrettyButton>
          <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
        </div>
    </form>
  </div>
</template>

<script>
import constraintService from '@/services/constraint.service'

import PrettyButton from '@/components/elem/PrettyButton'

export default {
  name: 'ConstraintFusion',
  components: {
    PrettyButton
  },
  props: {
    mainConstraint: Object,
    constraints: Array
  },
  data () {
    return {
      constraint: null,
      error: ''
    }
  },
  mounted () {
    if (this.constraints) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      var data = {
        mainConstraintId: this.mainConstraint.id,
        constraintId: this.constraint
      }
      // Fusion
      constraintService.fusion(data).then(res => {
        if (res.error) {
          this.error = res.error
        } else {
          this.$toasted.success('Enregistré !')
          this.init()
          this.$emit('fusion-done', res.deletedId)
        }
      })
    },

    init: function () {
      this.constraint = this.constraints && this.constraints.length ? this.constraints[0].id : null
      this.error = ''
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
