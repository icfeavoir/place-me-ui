<template>
  <div>
    <GroupForm :group=group />
    <div class="group-info">
      <p>Réservation effectuée le {{ group.createdAt }}</p>
      <p>Dernière modification le {{ group.updatedAt }}</p>
    </div>
  </div>
</template>

<script>
import groupService from '@/services/group.service'
import constraintService from '@/services/constraint.service'

import GroupForm from './GroupForm'

export default {
  name: 'GroupPage',
  components: {
    GroupForm
  },
  data () {
    return {
      groupId: this.$route.params.groupId,
      group: {}
    }
  },
  mounted () {
    const it = this
    groupService.findById(this.groupId).then(group => {
      // ils sont liés, on diot les faire ensemble
      constraintService.getAll().then((constraints) => {
        it.constraints = constraints
        // on met le nom de la contraine à jour ici
        let groupConstraint = constraints.find(c => c.id === group.constraint_id)
        if (groupConstraint) {
          group.constraintText = groupConstraint.name
        }
        it.group = group
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/group.scss';
</style>
