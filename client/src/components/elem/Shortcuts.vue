<template>
  <div class="help">
    <div class="help-container">
      <p class="help-name">RACCOURCIS CLAVIER</p>
      <table>
        <tr v-for="shortcut in shortcuts" :key="shortcut._id">
          <td class="name" v-html="shortcut.name"></td>
          <td class="keys"><p class="keys-text">{{ shortcut.keys.join(' + ').toLowerCase() }}</p></td>
        </tr>
      </table>
    </div>

    <div class="help-container">
      <p class="help-name">FONCTIONNALITÉS</p>
      <table>
        <tr v-for="func in funcs" :key="func._id">
          <td class="name"><p v-html="func.name"></p></td>
          <td v-if="func.keys" class="keys"><p class="keys-text">{{ func.keys ? func.keys.join(' + ').toLowerCase() : '' }}</p></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shortcuts',
  props: {
  },
  data () {
    return {
      shortcuts: [
        {name: 'Sélectionner tous les sièges', keys: ['ctrl', 'a']},
        {name: 'Sélectionner une zone entre 2 sièges', keys: ['shift', 'clic']},
        {name: 'Supprimer un siège', keys: ['suppr']},
        {name: 'Modifier une réservation', keys: ['ctrl', 'clic']},
        {name: 'Annuler la dernière action', keys: ['ctrl', 'shift', 'z']},
        {name: 'Rétablir l\'action annulée', keys: ['ctrl', 'z']},
        {name: 'Annuler la sélection de sièges', keys: ['échap']},
        {name: 'Annuler la sélection du groupe', keys: ['échap']},
        {name: 'Fermer cette fenêtre', keys: ['échap']}
      ],
      funcs: [
        {name: 'Un clic sur un siège le sélectionne, un second clic sur le même siège le déselectionne.'},
        {name: 'Pour sélectioner plusieurs sièges, il est possible de cliquer sur chaque siège, de cliquer sur un siège puis sur un second avec la touche <span class="keys-text">shift</span> enfoncée ou de cliquer sur un siège et bouger la souris en relachant le clic sur un second siège.'},
        {name: 'Si des sièges sont sélectionnés, cliquer sur un groupe assignera ce groupe aux sièges.'},
        {name: 'Si un groupe est sélectionné, cliquer sur un siège remplira le plan avec ce groupe de manière automatique à partir de ce siège jusqu\'à la fin de la rangée. Si la touche <span class="keys-text">shift</span> est enfoncée, le remplissage continuera sur la ligne suivante.'},
        {name: 'Le bouton <span class="main-btn"><i class="fa fa-running"></i>Générer</span> assigne les groupes aux sièges en prenant les groupes par ordre de personnes à placer.'},
        {name: 'Utilisez la barre de recherche pour trouver un groupe. En entrant juste un nombre, par exemple 3, la liste montrera les groupes ayant 3 personnes à placer.'},
        {name: 'L\'enregistrement se fait de manière automatique à chaque changement détecté. L\'enregistrement est terminé lorsque vous voyez ce symbole : <div class="saved"><i v-if="isSaved" class="fa fa-check fa-sm"></i>Sauvegardé</div>'}
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import '@/scss/shortcuts.scss';
</style>
