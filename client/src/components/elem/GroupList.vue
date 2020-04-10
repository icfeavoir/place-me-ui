<template>
  <div class='group-list-container'>

    <Modal
      v-if="showModalGroup && getSelectedGroup()"
      @close-modal="showModalGroup = false"
      :modal-style="modalGroupStyle"
      :closeBtn="false"
      :validateBtn="false"
    ><GroupForm :group="getSelectedGroup()" @data-changed="onGroupDataChanged"/></Modal>

    <input
      type="text"
      placeholder="Rechercher..."
      v-model="search"
      @keydown.esc="search = ''"
      @focus="focus = true"
      @blur="focus = false"
      :style="searchStyle"
    />
    <p class="bloc-info" v-if="groups && groups.length === 0">Aucun groupe</p>
    <table class="list" @keydown.esc="select(null)">
      <GroupLine
        v-for="group in groups.filter(g => g.remaining !== 0 && g.isVisible)"
        :key="group._id"
        :group="group"
        @group-click="onGroupClick"
        @group-drag="onGroupDrag"
        @group-line-changed="group => $emit('group-line-changed', group)"
      />
      <!-- SEPARATOR -->
      <tr class="around-separator"></tr>
      <tr class="group-done-separator"><td colspan="4">GROUPE FAIT</td></tr>
      <tr class="around-separator"></tr>
      <!-- GROUP DONE -->
      <GroupLine
        v-for="group in groups.filter(g => g.remaining === 0 && g.isVisible)"
        :key="group._id"
        :group="group"
        @group-click="onGroupClick"
        @group-drag="onGroupDrag"
      />
    </table>
  </div>
</template>

<script>
import Modal from '@/components/elem/Modal'
import GroupForm from '@/components/groups/GroupForm'
import GroupLine from '@/components/elem/GroupLine'

export default {
  name: 'GroupList',
  components: {
    Modal,
    GroupForm,
    GroupLine
  },
  props: {
    groups: []
  },
  data () {
    return {
      search: '',
      focus: false,
      isCtrlPressed: false,
      showModalGroup: false,
      modalGroupStyle: {
        width: 'fit-content',
        marginTop: 20
      }
    }
  },
  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
    window.addEventListener('blur', this.onFocusLost, true)
  },
  mounted () {
    this.groups.forEach(group => {
      this.$set(group, 'isVisible', true)
      this.$set(group, 'done', 0)
      this.$set(group, 'remaining', group.number)
    })
  },
  methods: {
    doSearch: function () {
      let search = this.search.toLowerCase()
      if (Number.isNaN(parseInt(search))) {
        this.groups.forEach(group => { group.isVisible = group.name.toLowerCase().includes(this.search.toLowerCase()) })
      } else {
        search = parseInt(search)
        this.groups.forEach(group => { group.isVisible = group.remaining === search })
      }
    },

    getSelectedGroup () {
      return this.groups.find(g => g.isSelected)
    },
    getGroupById (id) {
      return this.groups.find(g => g.id === id)
    },
    removeGroup (groupId) {
      this.groups = this.groups.filter(g => g.id !== groupId)
    },

    select: function (id, data = {}) {
      if (id) {
        let group
        if (Number.isInteger(id)) {
          group = this.groups.find(g => g.id === id)
        } else {
          group = id
        }
        // on remet la selection au nouveau (sauf s'il était déjà select dans ce cas on unselect)
        if (!group.isSelected) {
          // on unselect l'ancien
          this.unselect()
          this.$set(group, 'isSelected', true)
        } else {
          // on a cliqué sur le même, on deselect (sauf si on a clique pour drag)
          if (!data.drag && !data.force) {
            this.unselect()
          }
        }
        if (!data.drag) {
          // on emet le groupe cliqué
          this.$emit('select-group', group)
        }
      } else {
        this.unselect()
      }
    },
    unselect: function () {
      // on enlève la selection aux autres (en théorie max 1 autre mais bon)
      this.groups.filter(g => g.isSelected).forEach(group => { group.isSelected = false })
    },

    onGroupDataChanged (updatedGroup) {
      // quand on modifie un groupe avec le CTRL+clic
      let changes = updatedGroup.changes
      if (Object.entries(changes).length > 0) {
        let group = this.groups.find(g => g.id === updatedGroup.data.id)
        // on change chaque modif effectuée
        if (group) {
          Object.keys(changes).forEach(key => {
            if (key !== 'updatedAt') {
              group[key] = updatedGroup.data[key]
            }
          })

          let data = {group: group}
          // si on a supprimé des places alors que tout le groupe était placé.
          data.refreshPlan = updatedGroup.refreshPlan || false
          data.changeEventPlan = updatedGroup.changeEventPlan || false
          // on renvoie le group pour MAJ remaining
          this.$emit('group-changed', data)
        }
      }
      this.showModalGroup = false
      this.isCtrlPressed = false
    },
    onGroupDrag (group) {
      this.select(group, {drag: true}) // drag = true
    },
    onGroupClick (group) {
      if (!this.isCtrlPressed) {
        this.select(group.id)
      } else {
        // on force la sélection (pas de déselection)
        this.select(group.id, {force: true})
        this.showModalGroup = true
      }
    },
    keydown (event) {
      switch (event.keyCode) {
        case 17:
          // CTRL
          this.isCtrlPressed = true
          break
      }
    },
    keyup (event) {
      switch (event.keyCode) {
        case 17:
          // CTRL
          this.isCtrlPressed = false
          break

        case 27:
          // ESC
          this.select(null)
          break
      }
    },
    onFocusLost () {
      this.isCtrlPressed = false
    }
  },
  computed: {
    searchStyle () {
      let warn = this.focus === false && this.search.length > 0
      return {
        borderColor: warn ? this.colors.mainBlue : 'transparent',
        borderWidth: warn ? '2px' : '0px'
      }
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
  @import '@/scss/group-list.scss';
</style>
