<template>
  <div class="addCourseInfo">
<!--    <el-scrollbar style="height:100%" :noresize="true">-->
<!--    </el-scrollbar>-->
    <el-tabs class="courseInfo" v-model="courseInfoName">
      <el-tab-pane label="基本信息" name="first">
        <AddCourseFrom :isAdd="isAdd" :data="courseData" v-bind="addFormOptions" @save="update" @close="$emit('close')"/>
      </el-tab-pane>
      <el-tab-pane label="课程详情" name="second">
        <el-tabs class="courseDetails" v-if="courseData.id" v-model="activeName" @tab-click="handleClickTab" addable @tab-add="handleTabsAdd">
          <el-tab-pane v-for="(label, name) of tabsCourseData" :label="label" :name="name" :key="name">
            <component :is="name" :ref="name" :data="componentData"/>
          </el-tab-pane>
        </el-tabs>
        <div v-else class="prompt-box">
          <div class="prompt">
            <img class="imgStyle" src="@/assets/404_images/404.png" alt="">
            <p>基本信息暂未保存，暂不能进行课程详情填写，请先在 "<span>基本信息</span>" 页，<span>点击保存按钮！</span></p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      class="preview-dialog"
      top="5vh"
      title="课程预览"
      width="80%"
      :visible.sync="previewVisible"
      append-to-body
      @close="closePreview"
     >
      <Preview v-if="renderData.courseId" :course-id="courseData.id" :tabsCourseData="tabsCourseData" :renderData="renderData"/>
    </el-dialog>
  </div>
</template>

<script>
  import AddCourseFrom from './addCourseFrom'
  import CourseIntroduction from './courseIntroduction'
  import LearnContent from './chapterContent/index'
  import Preview from './preview/index'
  import * as api from '../api'

  export default {
    name: 'AddCourseInfo',
    components: {
      AddCourseFrom,
      CourseIntroduction,
      LearnContent,
      Preview
    },
    props: {
      isAdd: Boolean,
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        courseData: {},
        courseInfoName: 'first',
        activeName: 'CourseIntroduction',
        previewVisible: false,
        tabsCourseData: {
          CourseIntroduction: '课程简介',
          LearnContent: '学习内容'
        },
        componentData: {},
        renderData: {
          CourseIntroduction: {},
          LearnContent: {}
        },
        courseTypeOptions: [],
        examModeOptions: [],
        examTypeOptions: [],
        scoringModelOptions: [],
        teachingMethodOptions: []
      }
    },
    computed: {
      addFormOptions() {
        return {
          courseTypeOptions: this.courseTypeOptions,
          examModeOptions: this.examModeOptions,
          examTypeOptions: this.examTypeOptions,
          scoringModelOptions: this.scoringModelOptions,
          teachingMethodOptions: this.teachingMethodOptions
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.initOptions()
      },
      initCourseData(course = {}) {
        const courseData = { ...course }
        this.courseData = courseData
        this.$set(this.componentData, 'course', courseData)
      },
      initOptions() {
        api.listByCode({ code: '0016' }).then(res => {
          this.courseTypeOptions = res.data.map(e => ({ label: e.dictName, value: e.dictValue }))
        })
        api.listByCode({ code: '0018' }).then(res => {
          this.examModeOptions = res.data.map(e => ({ label: e.dictName, value: e.dictValue }))
        })
        api.listByCode({ code: '0019' }).then(res => {
          this.examTypeOptions = res.data.map(e => ({ label: e.dictName, value: e.dictValue }))
        })
        api.listByCode({ code: '0017' }).then(res => {
          this.scoringModelOptions = res.data.map(e => ({ label: e.dictName, value: e.dictValue }))
        })
        api.listByCode({ code: '0020' }).then(res => {
          this.teachingMethodOptions = res.data.map(e => ({ label: e.dictName, value: e.dictValue }))
        })
      },
      handleClickTab() {
      },
      update(val) {
        this.courseData = val
        this.$set(this.componentData, 'course', this.courseData)
        this.$emit('update')
      },
      handleTabsAdd() {
        this.previewVisible = true
        this.renderData.courseId = this.courseData.id
        this.renderData.CourseIntroduction = this.$refs.CourseIntroduction[0].getData()
        this.renderData.LearnContent = this.$refs.LearnContent[0].getData()
      },
      closePreview() {
        this.previewVisible = false
        this.renderData.courseId = ''
        this.renderData = {
          CourseIntroduction: {},
          LearnContent: {}
        }
      },
      cancel() {
        return false
      },
      confirm() {
        return false
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    color:#333;
    font-size: 20px;
    margin: 0;
    span {
      margin-left: 20px;
      font-size:16px;
      font-weight:500;
      color:#3F93DB;
    }
  }
  .prompt-box {
    height: 70vh;
    position: relative;
    .prompt {
      width: 540px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      p{
        color: #666;
        span {
          color: #333;
        }
      }
      .imgStyle {
        width: 200px;
        height: 200px;
        display: block;
        margin: 0 auto;
      }
    }
  }

  .addCourseInfo{
    min-height: 600px;
    .courseInfo {
       & > /deep/ .el-tabs__header {
         .el-tabs__nav-scroll {
            background-color: #F0F2F4;
           height: 56px;
          }
         .el-tabs__item{
           height: 56px;
           line-height: 56px;
           width: 120px;
           text-align: center;
           font-size:20px;
           font-weight:500;
           color:rgba(102,102,102,1);
           padding: 0;
          }
         .is-active {
           color:rgba(63,147,219,1);
           background-color: #fff;
         }
       }
    }
    .courseDetails {
      /deep/ .el-tabs__new-tab{
        height: 28px;
        width: 55px;
        line-height: 28px;
        border: none;
        i {
          display: none;
        }
        &:before{
          content: '预览课程';
        }
      }
    }
  }
</style>
