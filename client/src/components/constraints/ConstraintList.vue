<template>
  <div class='constraint-list-container'>
    <div class="input-container">
      <input
        type="text"
        placeholder="Rechercher..."
        v-model="search"
        @keydown.esc="search = ''"
      />
    </div>
    <p class="bloc-info" v-if="constraints && constraints.length === 0">Aucune contrainte</p>
    <table class="list" @keydown.esc="select(null)">
      <tr
        v-if="constraintForbid"
        :class="constraintForbid.isSelected ? 'selected constraint-data constraint-forbid' : 'constraint-data constraint-forbid'"
        @click="onConstraintClick(constraintForbid)"
      ><td class="name-container">{{ constraintForbid.name }}</td></tr>
      <!-- SEPARATOR -->
      <tr class="around-separator"></tr>
      <tr class="group-done-separator"><td colspan="4">CONTRAINTES</td></tr>
      <tr class="around-separator"></tr>
      <!-- GROUP DONE -->
      <tr
        v-for="constraint in constraints.filter(c => c.id > 0 && c.isVisible)"
        :class="constraint.isSelected ? 'selected constraint-data' : 'constraint-data'"
        :key="constraint._id"
        @click="onConstraintClick(constraint)"
      ><td class="name-container">{{ constraint.name }}</td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ConstraintList',
  components: {
  },
  props: {
    constraints: Array
  },
  data () {
    return {
      search: ''
    }
  },
  created () {
    window.addEventListener('keyup', this.keyup, true)
  },
  destroyed () {
    window.removeEventListener('keyup', this.keyup)
  },
  mounted () {
    // on ajoute la contrainte "INTERDIRE"
    this.constraints.push({
      id: 0,
      name: 'Interdit',
      isVisible: true,
      isSelected: false
    })
    // VALEURS PAR DÉFAUT
    this.constraints.forEach(constraint => {
      this.$set(constraint, 'isVisible', true)
      this.$set(constraint, 'isSelected', false)
    })
  },
  methods: {
    doSearch: function () {
      this.constraints.forEach(constraint => { constraint.isVisible = constraint.name.toLowerCase().includes(this.search.toLowerCase()) })
    },

    getSelectedConstraint () {
      return this.constraints.find(c => c.isSelected)
    },
    select: function (id) {
      if (id !== null) {
        let constraint = this.constraints.find(c => c.id === id)
        // on remet la selection au nouveau (sauf s'il était déjà select dans ce cas on unselect)
        if (!constraint.isSelected) {
          // on unselect l'ancien
          this.unselect()
          constraint.isSelected = true
        } else {
          // on a cliqué sur le même, on deselect (sauf si on a clique pour drag)
          this.unselect()
        }
      }
    },
    unselect: function () {
      // on enlève la selection aux autres (en théorie max 1 autre mais bon)
      this.constraints.filter(c => c.isSelected).forEach(constraint => { constraint.isSelected = false })
    },

    onConstraintClick (constraint) {
      this.select(constraint.id)
    },
    keyup (event) {
      switch (event.keyCode) {
        case 27:
          // ESC
          this.unselect()
          break
      }
    }
  },
  computed: {
    constraintForbid () {
      return this.constraints.find(c => c.id === 0)
    }
  },
  watch: {
    search: function (search, old) {
      this.doSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/form.scss';
</style>
<style lang="scss" scoped>
  @import '@/scss/constraint-list.scss';
</style>
