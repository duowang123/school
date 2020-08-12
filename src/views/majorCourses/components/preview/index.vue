<template>
  <div style="height: 700px">
    <el-tabs v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane v-for="(label, name) of tabsData" :label="label" :name="name" :key="name">
        <component :course-id="courseId" :is="name" :ref="name" v-bind="{ data: renderData[name] }"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CourseIntroduction from './courseIntroduction'
import LearnContent from './learnContent/index'

export default {
  name: 'Preview',
  props: {
    courseId: String,
    tabsCourseData: {
      type: Object
    },
    renderData: {
      type: Object
    }
  },
  components: {
    CourseIntroduction,
    LearnContent
  },
  watch: {
    // courseId: {
    //   handler() {
    //   },
    //   immediate: true
    // },
  },
  data() {
    return {
      tabsData: {
        ...this.tabsCourseData
      },
      activeName: 'CourseIntroduction'
    }
  },
  methods: {
    handleClickTab() {
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .el-container{
    height: 670px;
  }
  /deep/ .el-tabs__header{
    margin: 0;
  }
</style>
