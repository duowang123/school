<template>
  <div style="height: 700px">
    <el-tabs class="course-tabs" v-model="activeName" @tab-click="handleClickTab" type="border-card">
      <el-tab-pane v-for="(label, name) of tabsData" :label="label" :name="name" :key="name">
        <component :course-id="courseId" :is="name" :ref="name" v-bind="{ data: renderData[name] }"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as api from './api'
import CourseIntroduction from './courseIntroduction'
import LearnContent from './learnContent/index'
import axios from 'axios'

export default {
  name: 'Preview',
  props: {
    courseId: String,
    tabsCourseData: {
      type: Object
    },
  },
  components: {
    CourseIntroduction,
    LearnContent
  },
  watch: {
    courseId: {
      handler(id) {
        if (id) {
          this.initCourseData(id)
        } else {
          this.clearCourseData()
        }
      },
      immediate: true
    },
  },
  data() {
    return {
      tabsData: {
        ...this.tabsCourseData
      },
      renderData: {
        CourseIntroduction: {},
        LearnContent: {}
      },
      activeName: 'CourseIntroduction'
    }
  },
  methods: {
    initCourseData(id) {
      axios.all([api.getCourseIntroduce(id), api.getCourseMenuTree(id)]).then(axios.spread((...args) => {
        this.renderData.CourseIntroduction = args[0].data
        this.renderData.LearnContent = args[1].data
      }))
    },
    clearCourseData() {
      this.renderData = {
        CourseIntroduction: {},
        LearnContent: {}
      }
    },
    handleClickTab() {
    }
  }
}
</script>

<style scoped lang="scss">
  .course-tabs {
    /* 在全样式中被修改 */
  }
  /deep/ .el-container{
    /*height: 670px;*/
    height: calc(100vh - 180px);
  }
  /deep/ .el-tabs__header{
    margin: 0;
  }
</style>
