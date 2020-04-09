<template>
  <tr
    :class="isSelected ? 'selected group-data' : 'group-data'"
    :style="getStyle(group, 'bg')"
    @click="$emit('group-click', group)">
    <td class="name-container">
      <p class="name">
        <drag
        class="draggable"
        :style="getStyle(group, 'color')"
        :draggable="remaining > 0"
        :transfer-data="{group: group, auto: true}"
        @drag="$emit('group-drag', group)"
        >{{ name }}</drag>
      </p>
      <p v-if="group && group.constraint" class="constraint">{{ constraintText }}</p>
    </td>
    <td><div class="number-container"><p class="number">{{ number }}</p></div></td>
    <td><div class="number-container number-success"><p class="number">{{ done }}</p></div></td>
    <td><div :class="remaining ? 'number-container number-error' : 'number-container number-success'"><p class="number">{{ remaining }}</p></div></td>
  </tr>
</template>

<script>
import constraintService from '@/services/constraint.service'

export default {
  name: 'GroupLine',
  components: {
  },
  props: {
    group: {
      type: Object,
      default: () => {
        return {
          isSelected: false,
          number: 0,
          done: 0,
          remaining: 0,
          name: 'No name',
          constraint_id: null,
          constraint_number: 0,
          constraint_name: '',
          constraint: null,
          color: '#000000'
        }
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    if (this.group && this.group.constraint && this.group.constraint.name) {
      this.group.constraint_name = this.group.constraint.name
    }
  },
  methods: {
    getStyle (group, key) {
      return {
        bg: {backgroundColor: this.color || 'none'},
        color: {color: this.shoulColorBeDark(this.color) ? this.colors.bgColor : this.colors.lighterGrey}
      }[key]
    }
  },
  computed: {
    isSelected () {
      return this.group.isSelected || false
    },
    number () {
      return this.group.number || 0
    },
    done () {
      return this.group.done || 0
    },
    remaining () {
      return this.group.remaining || 0
    },
    name () {
      return this.group.name || 'No name'
    },
    color () {
      return this.group.color || '#000000'
    },
    constraintId () {
      return this.group.constraint_id || null
    },
    constraintNumber () {
      return this.group.constraint_number || 0
    },
    constraint () {
      return this.group.constraint
    },
    constraintName () {
      return this.group.constraint.name || this.group.constraint_name || ''
    },
    constraintText () {
      // on met le nombre de gens SI pas tout le monde
      return (this.constraintNumber === this.number ? '' : this.constraintNumber + ' en ') + this.constraintName
    }
  },
  watch: {
    constraintId (constraintId, old) {
      if (constraintId) {
        // on doit faire une requête pour récupérer les infos
        constraintService.findById(constraintId).then(constraint => {
          this.group.constraint = constraint
          this.group.constraint_name = constraint.name
        })
      } else {
        // suppr de la contrainte
        this.group.constraint = null
        this.group.constraint_name = ''
        this.group.constraint_number = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/group-line.scss';
</style>
