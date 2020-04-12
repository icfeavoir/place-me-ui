<template>
  <div class="form" @keydown.esc="init" :class="dark ? 'dark' : 'light'">
    <h2 class="form-title">{{ this.constraint ? name : 'Nouvelle contrainte'}}</h2>
     <form class="add-form" @keydown.enter="submit">
        <input v-focus id="name" @change="upperFirst" v-model="name" placeholder="Nom de la contrainte">
        <div class="submit-container">
          <input type="button" :value="constraint ? 'Modifier la contrainte' : 'Enregistrer'" @click="submit">
          <transition name="fade"><p class="error" v-if="error.length">{{ error }}</p></transition>
        </div>
    </form>
  </div>
</template>

<script>
import constraintService from '@/services/constraint.service'

export default {
  name: 'ConstraintForm',
  props: {
    constraint: Object,
    dark: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      name: '',
      error: ''
    }
  },
  mounted () {
    if (this.constraint) {
      this.init()
    }
  },
  methods: {
    submit: function () {
      var data = {
        name: this.name
      }

      if (this.constraint) {
        // UPDATE
        data.id = this.constraint.id
        constraintService.update(data).then(res => {
          if (res.error) {
            this.error = res.error
          } else {
            this.$toasted.success('Modifié !')
            // on émet la contrainte modifiée
            this.$emit('data-changed', res)
          }
        })
      } else {
        // NEW
        constraintService.create(data).then(res => {
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
      let constraint = this.constraint || {}
      this.name = constraint.name || ''
      this.error = ''
    },

    upperFirst: function () {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1)
    }
  },
  watch: {
    constraint: function (newConstraint, oldConstraint) {
      this.init()
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
