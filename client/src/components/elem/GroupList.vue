<template>
  <div class='group-list-container'>
    <!-- <drop class="droppable" @drop="groupDrag(1)"></drop> -->
    <input type="text" placeholder="Rechercher..." v-model="search" @keyup="doSearch" @keydown.esc="search = ''"/>
    <p class="bloc-info" v-if="groups && groups.length === 0">Aucun groupe</p>
    <table class="list" @keydown.esc="select(null)">
      <!-- GROUP A FAIRE -->
      <tr :class="group.isSelected ? 'selected group-data' : 'group-data'" v-for="group in groups.filter(g => g.remaining !== 0)" :key="group._id" @click="select(group.id)">
        <td v-if="group.visible" :key="group_id + '_1'" class="name-container">
          <p class="name">
            <drag :transfer-data="{group: group, auto: true}" class="draggable" :draggable="group.remaining > 0">{{ group.name }}</drag>
          </p>
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
export default {
  name: 'GroupList',
  components: {
  },
  props: {
    groups: []
  },
  data () {
    return {
    }
  },
  created () {
    const it = this
    document.addEventListener('keyup', function (evt) {
      if (evt.keyCode === 27) {
        it.select(null)
      }
    })
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

    select: function (id) {
      if (id) {
        let group = this.groups.find(g => g.id === id)
        // on remet la selection au nouveau (sauf s'il était déjà select dans ce cas on unselect)
        if (!group.isSelected) {
          // on unselect l'ancien
          this.unselect()
          this.$set(group, 'isSelected', true)
        } else {
          this.unselect()
        }
        // on emet le groupe cliqué
        this.$emit('select-group', group)
      } else {
        this.unselect()
      }
    },
    unselect: function () {
      // on enlève la selection aux autres (en théorie max 1 autre mais bon)
      this.groups.filter(g => g.isSelected).forEach(group => { group.isSelected = false })
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
