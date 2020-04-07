<template>
  <div class='group-list-container'>

    <Modal
      v-if="showModal && getSelectedGroup()"
      @close-modal="showModal = false"
      @valid-modal="addPlan"
      :modal-style="modalStyle"
      :closeBtn="false"
      :validateBtn="false"
    >
      <GroupForm :group="getSelectedGroup()" @data-changed="onGroupDataChanged"/>
    </Modal>

    <input type="text" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''"/>
    <p class="bloc-info" v-if="groups && groups.length === 0">Aucun groupe</p>
    <table class="list" @keydown.esc="select(null)">
      <!-- GROUP A FAIRE -->
      <tr
        :class="group.isSelected ? 'selected group-data' : 'group-data'"
        v-for="group in groups.filter(g => g.remaining !== 0)"
        :key="group._id"
        :style="getStyle(group, 'bg')"
        @click="onClick(group.id)">
        <td v-if="group.visible" :key="group_id + '_1'" class="name-container">
          <p class="name">
            <drag
            class="draggable"
            :style="getStyle(group, 'color')"
            :draggable="group.remaining > 0"
            :transfer-data="{group: group, auto: true}"
            @drag="onDrag(group)"
            >{{ group.name }}</drag>
          </p>
          <p v-if="group.constraint" class="constraint">{{ group.constraint.name }}</p>
        </td>
        <td v-if="group.visible" :key="group_id + '_2'"><div class="number-container"><p class="number">{{ group.number }}</p></div></td>
        <td v-if="group.visible" :key="group_id + '_3'"><div class="number-container number-success"><p class="number">{{ group.done }}</p></div></td>
        <td v-if="group.visible" :key="group_id + '_4'"><div :class="group.remaining ? 'number-container number-error' : 'number-container number-success'"><p class="number">{{ group.remaining }}</p></div></td>
      </tr>
      <!-- SEPARATOR -->
      <tr class="group-data group-done-separator"><td colspan="4">GROUPE FAIT</td></tr>
      <!-- GROUP DONE -->
      <tr class="group-data" v-for="group in groups.filter(g => g.remaining === 0)" :key="group._id">
        <td v-if="group.visible" :key="group_id + '_1'" class="name-container">
          <p class="name">
            <drag :transfer-data="group" class="draggable" :draggable="group.remaining > 0">{{ group.name }}</drag>
          </p>
        </td>
        <td v-if="group.visible" :key="group_id + '_2'"><div class="number-container"><p class="number">{{ group.number }}</p></div></td>
        <td v-if="group.visible" :key="group_id + '_3'"><div class="number-container number-success"><p class="number">{{ group.done }}</p></div></td>
        <td v-if="group.visible" :key="group_id + '_4'"><div :class="group.remaining ? 'number-container number-error' : 'number-container number-success'"><p class="number">{{ group.remaining }}</p></div></td>
      </tr>
    </table>
  </div>
</template>

<script>
import Modal from '@/components/elem/Modal'
import GroupForm from '@/components/groups/GroupForm'

export default {
  name: 'GroupList',
  components: {
    Modal,
    GroupForm
  },
  props: {
    groups: []
  },
  data () {
    return {
      isCtrlPressed: false,
      showModal: false,
      modalStyle: {
        width: 'fit-content',
        marginTop: 20
      }
    }
  },
  created () {
    window.addEventListener('keydown', this.keydown, true)
    window.addEventListener('keyup', this.keyup, true)
  },
  mounted () {
    this.groups.forEach(group => {
      this.$set(group, 'visible', true)
      this.$set(group, 'done', 0)
      this.$set(group, 'remaining', group.number)
    })
  },
  methods: {
    doSearch: function () {
      this.groups.forEach(group => { group.visible = group.name.toLowerCase().includes(this.search.toLowerCase()) })
    },

    getSelectedGroup () {
      return this.groups.find(g => g.isSelected)
    },
    getGroupById (id) {
      return this.groups.find(g => g.id === id)
    },

    getStyle (group, key) {
      return {
        bg: {backgroundColor: group.color || 'none'},
        color: {color: this.shoulColorBeDark(group.color) ? this.colors.bgColor : this.colors.lighterGrey}
      }[key]
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
      console.log(changes, updatedGroup)
      if (Object.entries(changes).length > 0) {
        let group = this.groups.find(g => g.id === updatedGroup.data.id)
        // on change chaque modif effectuée
        if (group) {
          Object.keys(changes).forEach(key => {
            if (key !== 'updatedAt') {
              group[key] = updatedGroup.data[key]
            }
          })
          // on renvoie le group pour MAJ remaining
          this.$emit('group-changed', { group: group, count: 0 })
        }
      }
      // this.showModal = false
      this.isCtrlPressed = false
    },
    onDrag (group) {
      this.select(group, {drag: true}) // drag = true
    },
    onClick (groupId) {
      if (!this.isCtrlPressed) {
        this.select(groupId)
      } else {
        // on force la sélection (pas de déselection)
        this.select(groupId, {force: true})
        this.showModal = true
      }
    },
    keydown: function (event) {
      switch (event.keyCode) {
        case 17:
          // CTRL
          this.isCtrlPressed = true
          break
      }
    },
    keyup: function (event) {
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
