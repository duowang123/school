export default {
  inject: ['appMainStyle'],
  computed: {
    tableHeight() {
      // return 0 + 'px'
      // return this.appMainStyle.height - 24 - 52 - 51 - 5 + 'px'
      const height = window.innerHeight
      return height - 180 - 50 - 24 - 2 + 'px'
    }
  }
}
