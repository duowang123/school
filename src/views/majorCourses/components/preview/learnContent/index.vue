<template>
  <el-container >
    <el-aside class="aside" width="280px">
      <Directory :treeData="directoryTree" @nodeClick="changeChapterCont"/>
    </el-aside>
    <el-main class="main" style="padding: 0">
      <template v-if="tabs.length">
        <el-tabs  @tab-click="handleClick" v-model="activeIndex">
          <el-tab-pane :key="tab.navId" :label="tab.content" :name="index+''" v-for="(tab, index) of tabs">
            <component :chapter-id="courseMenuId" :chapterCont="curChapterCont" :course-id="courseId" :is="curChapterCont.key" v-if="curChapterCont.key"/>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div v-else style="text-align: center; margin-top: 50px">
        <img src="/src/assets/images/img-missing.png" alt="">
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import Directory from './directory'
  import teachVideo from './teachVideo'
  import courseMaterial from './courseMaterial'
  import courseTopicDiscusses from './topicDiscuss'
  import * as api from './api'
  import { chapterKeyMap } from './constant'
  export default {
    name: 'PreviewLearnContent',
    props: {
      courseId: String
    },
    components: {
      Directory,
      courseMaterial,
      teachVideo,
      courseTopicDiscusses
    },
    data() {
      return {
        directoryTree: [],
        courseMenuId: '',
        activeIndex: '',
        prevActiveName: '',
        tabs: [],
        tabsCont: new Map(),
        curChapterCont: {}
      }
    },
    computed: {
      comment() {
        return {
          courseMenuId: this.courseMenuId,
          courseId: this.courseId
        }
      },
      activeNavId() {
        return this.tabs[this.activeIndex] ? this.tabs[this.activeIndex].navId : ''
      }
    },
    watch: {
      courseId: {
        immediate: true,
        handler() {
          this.getCourseMenuTree()
        }
      },
      hasLearnCont: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.handleClick({ name: this.activeIndex })
            })
          }
        },
        immediate: true
      }
    },
    methods: {
      getCourseMenuTree() {
        api.getCourseMenuTree(this.courseId).then(res => {
          this.directoryTree = res.data
        })
      },
      changeChapterCont(data) {
        if (this.courseMenuId === data.id) {
          return void ''
        }
        if (data.parentId === '-1') {
          this.tabs = []
          return void '一级菜单只做一个锚点'
        }
        this.courseMenuId = data.id
        api.getChapterCont({ courseId: this.courseId, courseMenuId: data.id }).then(res => {
          const { navigations } = res.data
          this.tabs = navigations || []
          this.activeIndex = ''
          navigations[0] && this.getTabCont(0, () => {
            this.curChapterCont = this.tabsCont.get(this.tabs[0].navId)
          })
        })
      },
      getTabCont(index = 0, callback) {
        const tab = this.tabs[index]
        const { courseType, navId } = tab
        const typeMap = {
          '1': { apiName: 'getDoc', key: 'courseMaterial' },
          '2': { apiName: 'getVideo', key: 'teachVideo' },
          '3': { apiName: 'getDiscusses', key: 'courseTopicDiscusses' }
        }
        const params = {
          courseId: this.courseId,
          courseMenuId: this.courseMenuId,
          navId
        }
        api[typeMap[courseType].apiName](params).then(res => {
          if (res.code === 200) {
            res.data.navId = navId
            const cont = this.$_cloneDeep(chapterKeyMap[typeMap[courseType].key])
            this.tabsCont.set(navId, { ...cont, ...res.data })
            this.$nextTick(() => {
              callback && callback()
            })
          }
        })
      },
      handleClick(data) {
        const index = data.name + ''
        const tab = this.tabs[index]
        if (this.tabsCont.get(tab.navId)) {
          this.curChapterCont = this.tabsCont.get(tab.navId)
          return void '已获取数据'
        } else {
          this.getTabCont(index, () => {
            this.activeIndex = index
            this.curChapterCont = this.tabsCont.get(tab.navId)
            console.log(this.curChapterCont);
          })
        }
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
