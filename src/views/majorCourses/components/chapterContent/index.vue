<template>
  <el-container>
    <el-aside width="300px">
      <Directory
          :treeData="menuTree"
          :course-id="courseId"
          @change-chapter="changeChapterCont"
          @update-menu="getCourseMenuTree"
      />
    </el-aside>
    <el-container>
      <el-main>
        <div class="title"><span style="margin-right: 25px">章节内容</span> <el-button @click="updateChapterCont" type="text">保存</el-button> </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(label, key) of tabs" :label="label" :key="key" :name="label">
            <ChapterContent
                ref="chapterContent"
                :componentName="key"
                :active-key="activeChapterContKey"
                :chapter-cont="curChapterCont"/>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Directory from './directory'
  import ChapterContent from './chapterContent'
  import { CHAPTER_CONT_TYPE, chapterKeyMap } from './constant'
  import * as api from './api'
  import { cloneDeep } from 'loadsh'
    export default {
      name: 'LearnContent',
      inject: ['organId', 'courseData'],
      components: {
        Directory,
        ChapterContent
      },
      props: {
        data: Object
      },
      computed: {
        courseId() {
          return this.data.course.id || ''
        }
      },
      data() {
        return {
          activeName: '',
          activeChapterContKey: '',
          curChapterId: '',
          curChapterCont: {},
          tabs: [],
          checkData: {
            [CHAPTER_CONT_TYPE.daoxue]: '导学',
            [CHAPTER_CONT_TYPE.shipin]: '教学视频',
            [CHAPTER_CONT_TYPE.cailiao]: '学习材料',
            [CHAPTER_CONT_TYPE.ziyuan]: '拓展资源',
            [CHAPTER_CONT_TYPE.taolun]: '主题讨论'
          },
          menuTree: []
        }
      },
      watch: {
        'courseId': {
          handler(val) {
            if (val) {
              this.getCourseMenuTree()
            } else {
              this.menuTree = []
            }
          },
          immediate: true
        }
      },
      methods: {
        getCourseMenuTree() {
          api.getCourseMenuTree(this.data.course.id).then(res => {
            this.menuTree = res.data
          })
        },
        getBindData(key) {
          return { chapterCont: this.curChapterCont }
        },
        addChapterTabs() {
          const type = ['导学', '教学视频', '学习材料', '拓展资源', '主题讨论']
          const data = Object.entries(this.checkData).reduce((pre, [key, val]) => {
            pre[key] = val
            return pre
          }, {})
          this.activeName = type[0]
          this.tabs = data
          this.activeChapterContKey = chapterKeyMap[this.activeName].key
          const chapterCont = {
            courseMenuId: this.curChapterCont.courseMenuId,
            courseId: this.courseId
          }
          type.forEach(name => {
            const { key, cont } = chapterKeyMap[name]
            chapterCont[key] = { ...cloneDeep(cont) }
          })
          this.curChapterCont = chapterCont
          this.initData()
        },
        changeChapterCont(data) {
          if (this.curChapterId === data.id) {
            return void ''
          }
          this.curChapterId = data.id
          api.getChapterCont({ courseId: this.courseId, courseMenuId: data.id }).then(res => {
            this.curChapterCont = res.data
            const typeKeys = Object.keys(res.data)
            if (typeKeys.length <= 2) {
              this.tabs = {}
              this.addChapterTabs()
              return void '还没有内容'
            }
            this.tabs = Object.entries(this.checkData).reduce((pre, [key, val]) => {
              if (typeKeys.includes(key)) {
                pre[key] = val
              }
              return pre
            }, {})
            this.getActiveName()
            this.initData()
          })
        },
        initData() {
          this.$nextTick(() => {
            this.$refs.chapterContent.forEach(el => {
              el && el.initData()
            })
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
        updateChapterCont() {
          api.updateChapterCont(this.curChapterCont).then(res => {
            if (res.code === 200) {
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新失败')
            }
          })
        },
        handleClick() {
          this.activeChapterContKey = chapterKeyMap[this.activeName].key
        },
        getData() {
          return {
            treeData: this.menuTree
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  .title {
    font-weight:500;
    padding: 20px 0;
    margin: 0;
    border-bottom: 2px solid #F8F9FB;
  }
  .box {
    /deep/ .el-tabs__header {
      .el-tabs__nav-scroll {
        background-color: #F0F2F4;
      }
      .el-tabs__item{
        width: 120px;
        text-align: center;
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
</style>
