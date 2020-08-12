<template>
  <el-container>
      <el-aside class="infoBox" width="280px">
        <img class="header" :src="photoUrl" alt="">
        <p class="borderLine">{{name}}</p>
        <p>教师简介：</p>
        <p>{{info}}</p>
      </el-aside>
      <el-main v-html="introduce">
      </el-main>
  </el-container>
</template>

<script>
import { getToken } from '@/utils/auth'
import { BASE_API } from '@/constant/global'
export default {
  name: 'PreviewCourseIntroduction',
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    photoUrl() {
      return this.data.photoUrl ? `${BASE_API}/course/${this.data.photoUrl}?token=${getToken()}` : ''
    },
    name() {
      return this.data.teacherName || ''
    },
    info() {
      return this.data.teacherIntroduce || ''
    },
    introduce() {
      return this.data.courseIntroduce || ''
    }
  }
}
</script>

<style scoped lang="scss">
  .infoBox {
    border-right: 2px solid #E0E8EF;
    padding: 0 20px;
    .header{
      width: 128px;
      height: 128px;
      border-radius: 50%;
      margin: 32px auto;
      display: block;
    }
    .borderLine {
      padding: 10px 0;
      text-align: center;
    }
  }

</style>
