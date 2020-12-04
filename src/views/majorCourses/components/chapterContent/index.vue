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
      <el-main v-show="courseMenuId">
        <div class="title">
          <span style="margin-right: 25px">章节内容</span>
          <el-button @click="updateChapterCont" type="text">保存</el-button>
        </div>
        <div class="zk-tabs">
          <div class="tab-label">
            <template v-for="(tab, index) in tabs">
              <div :class="{'tab-cont': true, 'active': activeIndex === index}" :key="tab.navId" @click="handleClick(index)">
                <span class="name">{{tab.content}}</span>
                <i class='iconfont icon-edit' @click="editTabName(tab)"></i>
                <i class='iconfont icon-close-nor' @click="delTab(index)"></i>
              </div>
            </template>
          </div>
          <div class="operator" >
            <el-dropdown @command="addTabs" trigger="click">
              <span class="el-dropdown-link el-tabs__new-tab"><i class="el-icon-plus"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="courseMaterial">文档页</el-dropdown-item>
                <el-dropdown-item command="teachVideo">视频页</el-dropdown-item>
                <el-dropdown-item command="courseTopicDiscusses">讨论页</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div>
          <ChapterContent
            ref="chapterContent"
            :chapter-cont="curChapterCont"/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Directory from './directory'
  import ChapterContent from './chapterContent'
  import { chapterKeyMap } from '../preview/learnContent/constant'
  import * as api from './api'

  export default {
      name: 'LearnContent',
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
        },
        comment() {
          return {
            courseMenuId: this.courseMenuId,
            courseId: this.courseId
          }
        },
        activeNavId() {
          return this.tabs[this.activeIndex] ? this.tabs[this.activeIndex].navId : ''
        },
        curChapterCont() {
          return this.tabsCont.get(this.activeNavId) || {}
        }
      },
      data() {
        return {
          activeIndex: -1,
          courseMenuId: '',
          tabs: [],
          tabsCont: new Map(),
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
        generateUUID() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
          })
        },
        getCourseMenuTree() {
          api.getCourseMenuTree(this.data.course.id).then(res => {
            this.menuTree = res.data
          })
        },
        addTabs(command) {
          const uuid = this.generateUUID()
          const cont = this.$_cloneDeep(chapterKeyMap[command])
          cont.navId = uuid
          this.tabs.push({
            navId: uuid,
            courseType: cont.courseType,
            content: cont.label
          })
          this.tabsCont.set(uuid, cont)
        },
        changeChapterCont(data) {
          if (this.courseMenuId === data.id) {
            return void ''
          }
          this.courseMenuId = data.id
          api.getChapterCont({ courseId: this.courseId, courseMenuId: data.id }).then(res => {
            const { navigations } = res.data
            this.tabs = navigations || []
            navigations[0] && this.getTabCont(navigations[0], () => {
              this.activeIndex = 0
            })
          })
        },
        getTabCont(tab, callback) {
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
            console.log(res);
            if (res.code === 200) {
              res.data.navId = navId
              const cont = this.$_cloneDeep(chapterKeyMap[typeMap[courseType].key])
              this.tabsCont.set(navId, Object.assign(cont, res.data))
              callback && callback()
            }
          })
        },
        updateChapterCont() {
          const params = {
            ...this.comment,
            ...this.formatCourseJson()
          }
          api.updateChapterCont(params).then(res => {
            if (res.code === 200) {
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新失败')
            }
          })
        },
        formatCourseJson(cont) {
          const ret = {
            navigations: this.tabs
          }
          this.tabsCont.forEach(e => {
            ret[e.key] = ret[e.key] || []
            ret[e.key].push(e)
          })
          return ret
        },
        handleClick(index) {
          const tab = this.tabs[index]
          if (this.tabsCont.get(tab.navId)) {
            this.activeIndex = index
            return void '已获取数据'
          } else {
            this.getTabCont(tab, () => {
              this.activeIndex = index
            })
          }
        },
        editTabName(tab) {
          this.$prompt('请输入名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: tab.content,
            inputValidator: (e) => {
              return !!e
            },
            inputErrorMessage: '请输入名称'
          }).then(({ value }) => {
            tab.content = value
          })
        },
        delTab(index) {
          this.tabs = this.tabs.filter((e, i) => i !== index)
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
  .zk-tabs {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    .tab-label {
      display: flex;
      flex-direction: row;
      .tab-cont {
        height: 40px;
        padding: 0 20px;
        &.active {
          color: #3F93DB;
        }
        &:hover {
          color: #3F93DB;
          cursor: pointer;
        }
      }
    }
  }
</style>
