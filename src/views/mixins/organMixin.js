import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      organId: ''
    }
  },
  created() {
    this.organId = this.$_getValue(this.organList, '0.id', '')
    this.init()
  },
  computed: {
    ...mapGetters(['organList'])
  },
  methods: {
    async init() {
      this.getTableData()
    }
  }
}
