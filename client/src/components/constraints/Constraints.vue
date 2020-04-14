<template>
  <div>
    <Modal
      v-if="showModalConstraint"
      @close-modal="showModalConstraint = false"
      :modal-style="{width: 'fit-content', marginTop: 20}"
      :closeBtn="false"
      :validateBtn="false"
    >
      <ConstraintFusion v-if="isModalFusion && constraints.length > 0" :mainConstraint="constraintClicked" :constraints="constraintFusionList" @fusion-done="fusionDone" />
      <ConstraintForm v-else :constraint="constraintClicked" @data-changed="updateConstraint" :dark="false" />
    </Modal>

    <header>
      <input ref="search" type="text" class="search" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''" />
      <router-link :to='{name: "ConstraintAdd"}'><PrettyButton :allowSmall="false" icon="plus-circle">Nouvelle contrainte</PrettyButton></router-link>
    </header>
    <div class='list'>
      <p class="bloc-info" v-if="constraints && constraints.length === 0">Aucune contrainte</p>
      <div class="constraint" v-for='constraint in constraints' :key='constraint._id'>
        <Card
          :data="{
            title: constraint.name,
            obj: constraint
          }"
          @click="openConstraint(constraint)"
          @del='deleteConstraint'
        >
          <PrettyButton class="square small-btn center" @click="openFusion(constraint)" :allowSmall="false" icon="link">Fusionner avec</PrettyButton>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import constraintService from '@/services/constraint.service'

import Card from '@/components/elem/Card'
import Modal from '@/components/elem/Modal'
import PrettyButton from '@/components/elem/PrettyButton'

import ConstraintForm from '@/components/constraints/ConstraintForm'
import ConstraintFusion from '@/components/constraints/ConstraintFusion'

export default {
  name: 'Constraints',
  components: {
    Card,
    PrettyButton,
    Modal,
    ConstraintForm,
    ConstraintFusion
  },
  data () {
    return {
      allConstraints: [],
      constraints: null,
      showModalConstraint: false,
      constraintClicked: {},
      isModalFusion: false,
      constraintFusionList: [],

      search: ''
    }
  },
  created: function () {
    constraintService.getAll()
      .then((constraints) => {
        this.$set(this, 'allConstraints', constraints)
        this.$set(this, 'constraints', constraints)
      })
  },
  mounted () {
    if (this.isMobileAndTabletcheck() === false) {
      this.$refs.search.focus()
    }
  },
  methods: {
    deleteConstraint: function (constraint) {
      const id = constraint.id
      const it = this
      if (id) {
        let msg = {
          title: 'Supprimer une contrainte',
          body: 'Voulez-vous supprimer la contrainte <b>' + constraint.name + '</b> ?'
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
            constraintService.delete(id).then(res => {
              if (res.success) {
                // remove from constraints
                it.constraints = it.constraints.filter((constraint) => {
                  return constraint.id !== id
                })
                it.$toasted.success('Contrainte supprimée !')
              }
            })
          })
          .catch(function () {})
      }
    },

    doSearch: function () {
      this.constraints = this.allConstraints.filter((constraint) => constraint.name.toLowerCase().includes(this.search.toLowerCase()))
    },

    openConstraint (constraint) {
      this.isModalFusion = false
      this.constraintClicked = constraint
      this.showModalConstraint = true
    },
    updateConstraint (update) {
      this.showModalConstraint = false
      this.constraintClicked = null
      // seul le nom peut changer
      if (update.data && update.data.name) {
        update = update.data
        this.allConstraints.find(c => c.id === update.id).name = update.name
        this.doSearch()
      }
    },
    openFusion (constraint) {
      this.isModalFusion = true
      this.constraintClicked = constraint
      this.showModalConstraint = true
      this.constraintFusionList = this.allConstraints.filter(c => c.id !== constraint.id)
    },
    fusionDone (deletedConstraintId) {
      this.showModalConstraint = false
      this.constraintClicked = null
      if (deletedConstraintId) {
        this.allConstraints = this.allConstraints.filter(c => c.id !== deletedConstraintId)
        this.doSearch()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/home-list.scss';
</style>
