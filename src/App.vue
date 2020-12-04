<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  created() {
    // 不判断会直接查询，会报错
    if (getToken()) {
      this.$store.dispatch('updategetSchoolOrgansList')
      this.$store.dispatch('updateSchoolList')
      this.$store.dispatch('updateTeacherList')
      this.$store.dispatch('updateIdentificationList')
      this.$store.dispatch('getYearAndSemester')
    }
  }
}
</script>
