export const utils = {
  data () {
    return {
      colors: {
        bgColor: '#18191a',
        darkGrey: '#2A2A2E',
        lightGrey: '#BABABB',
        lighterGrey: '#E7E7E7',
        mainBlue: '#0079BF',
        mainRed: '#8c343a',
        mainGreen: '#348c38',
        lightRed: '#e5323e'
      }
    }
  },
  methods: {
    shoulColorBeDark (bg) {
      if (!bg) {
        return true
      }
      if (bg.includes('#')) {
        bg = this.hexToRgb(bg)
      }
      var color = Math.round(((parseInt(bg.r) * 299) +
          (parseInt(bg.g) * 587) +
          (parseInt(bg.b) * 114)) / 1000)
      return color > 125
    },
    hexToRgb (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }
  }
}
