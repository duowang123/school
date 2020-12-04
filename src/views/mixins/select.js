import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      organListAll: [], // 教学点下拉框包括全部
      schoolOrgansListAll: [] // 学校下拉框包括全部
    }
  },
  computed: {
    ...mapGetters(['organList', 'teacherList', 'schoolOrgansList']),
    isAll() {
      return this.$store.getters.userOrganId + '' === '1'
    },
    showSchool() {
      return this.isAll || this.isSchool
    },
    isSchool() {
      return (
        this.$store.getters.property && this.$store.getters.property === '1'
      )
    },
    showTeacher() {
      return this.isAll || this.isTeacher
    },
    isTeacher() {
      return (
        this.$store.getters.property && this.$store.getters.property === '2'
      )
    }
  },
  created() {
    const all = {
      id: '',
      name: '全部',
      oldName: '全部'
    }
    this.organListAll = [all, ...this.teacherList] // 所有教学点
    this.schoolOrgansListAll = [all, ...this.schoolOrgansList] // 学校
  }
}
