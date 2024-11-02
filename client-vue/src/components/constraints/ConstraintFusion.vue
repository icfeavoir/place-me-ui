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
      let constraint = this.constraints.find(c => c.id === this.constraint)
      var data = {
        mainConstraintId: this.mainConstraint.id,
        constraintId: constraint.id
      }
      const it = this
      if (constraint) {
        let msg = {
          title: 'Fusionner 2 contraintes',
          body: 'Les groupes avec la contrainte <b>' + constraint.name + '</b> auront désormais la contrainte <b>' + this.mainConstraint.name + '</b>. Voulez-vous confirmer ?'
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
            // Fusion
            constraintService.fusion(data).then(res => {
              if (res.error) {
                it.error = res.error
              } else {
                it.$toasted.success('Enregistré !')
                it.init()
                it.$emit('fusion-done', res.deletedId)
              }
            })
          })
          .catch(function () {})
      }
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
