<template>
  <el-container >
    <el-aside class="aside" width="280px">
      <Directory :treeData="data" @nodeClick="changeChapterCont"/>
    </el-aside>
    <el-main class="main" style="padding: 0">
      <el-tabs v-if="Object.keys(tabs).length" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(label, name) of tabs" :label="label" :key="name" :name="label">
          <component :course-id="courseId" :chapter-id="curChapterId" :is="name" :ref="name" :chapterCont="curChapterCont"/>
        </el-tab-pane>
      </el-tabs>
      <div v-else style="text-align: center; margin-top: 50px">
        <img src="/src/assets/images/img-missing.png" alt="">
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import Directory from './directory'
  import courseGuide from './guided'
  import teachVideo from './teachVideo'
  import courseExpandResource from './expandResources'
  import courseMaterial from './learnMaterial'
  import courseTopicDiscusses from './topicDiscuss'
  import * as api from '../api'
  import { CHAPTER_CONT_TYPE } from './constant'
  export default {
    name: 'PreviewLearnContent',
    props: {
      data: {
        type: Object
      },
      courseId: String,
    },
    components: {
      Directory,
      courseGuide,
      courseExpandResource,
      courseMaterial,
      teachVideo,
      courseTopicDiscusses
    },
    data() {
      return {
        curChapterId: '',
        curChapterCont: {},
        checkData: {
          [CHAPTER_CONT_TYPE.daoxue]: '导学',
          [CHAPTER_CONT_TYPE.shipin]: '教学视频',
          [CHAPTER_CONT_TYPE.cailiao]: '学习材料',
          [CHAPTER_CONT_TYPE.ziyuan]: '拓展资源',
          [CHAPTER_CONT_TYPE.taolun]: '主题讨论'
        },
        activeName: '',
        prevActiveName: '',
        tabs: [],
      }
    },
    computed: {
      hasLearnCont() {
        return Object.keys(this.curChapterCont || {}).length > 2
      },
    },
    watch: {
      hasLearnCont: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.handleClick({name: this.activeName})
            })
          }
        },
        immediate: true
      }
    },
    methods: {
      changeChapterCont(data) {
        if (this.curChapterId === data.id) {
          return void ''
        }
        this.curChapterId = data.id
        api.getChapterCont({ courseId: this.courseId, courseMenuId: data.id }).then(res => {
          this.curChapterCont = res.data
          // if (this.curChapterCont.teachVideo) {
          //   this.curChapterCont.teachVideo.content = JSON.parse(this.curChapterCont.teachVideo.content)
          // }
          const typeKeys = Object.keys(res.data)
          if (typeKeys.length <= 2) {
            this.tabs = {}
            return void '还没有内容'
          }
          this.tabs = Object.entries(this.checkData).reduce((pre, [key, val]) => {
            if (typeKeys.includes(key) && Object.keys(res.data[key]).length) {
              pre[key] = val
            }
            return pre
          }, {})
          this.getActiveName()
        })
      },
      getActiveName() {
        switch (true) {
          case this.curChapterCont[CHAPTER_CONT_TYPE.daoxue]: this.activeName = this.checkData[CHAPTER_CONT_TYPE.daoxue]; break;
          case this.curChapterCont[CHAPTER_CONT_TYPE.shipin]: this.activeName = this.checkData[CHAPTER_CONT_TYPE.shipin]; break;
          case this.curChapterCont[CHAPTER_CONT_TYPE.cailiao]: this.activeName = this.checkData[CHAPTER_CONT_TYPE.cailiao]; break;
          case this.curChapterCont[CHAPTER_CONT_TYPE.ziyuan]: this.activeName = this.checkData[CHAPTER_CONT_TYPE.ziyuan]; break;
          case this.curChapterCont[CHAPTER_CONT_TYPE.taolun]: this.activeName = this.checkData[CHAPTER_CONT_TYPE.taolun]; break;
          default: this.activeName = '导学'
        }
      },
      handleClick(data) {
        // if (this.prevActiveName && this.prevActiveName !== data.name) {
        //   const { key, cont } = chapterKeyMap[this.prevActiveName]
        //   const ref = this.$refs[key][0]
        //   this.prevActiveName = this.activeName
        //   this.$nextTick(() => {
        //     console.log(ref)
        //     cont.courseType && ref.stopStudy()
        //   })
        // }
        //
        // const { key, cont } = chapterKeyMap[data.name]
        // const ref = this.$refs[key][0]
        // this.$nextTick(() => {
        //   console.log(ref)
        //   cont.courseType && ref.updateTime(cont.courseType)
        // })
      }
    }
  }
</script>

<style scoped lang="scss">
/deep/ .el-aside{
  padding: 15px 0;
  border-right: 2px solid #E0E8EF;
  z-index: 99999;
}
.title {
  font-weight:500;
  padding: 20px 0;
  margin: 0;
  border-bottom: 2px solid #F8F9FB;
}
.main {
  /deep/ .el-tabs__header {
    .el-tabs__nav-scroll {
      margin-top: 12px;
    }
    .el-tabs__item{
      width: 120px;
      text-align: center;
      font-weight:500;
      padding: 0;
    }
  }
  /deep/ {
    .content {
      padding: 0 34px;
    }
  }
}
</style>
