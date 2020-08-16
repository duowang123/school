<template>
  <div>
    <div class="header-bar">
      <div class="course-name">当前视频名称: <span class="sel-course">{{selName}}</span></div>
      <el-input
        prefix-icon="el-icon-search"
        class="search"
        placeholder="请输入课程名称"
        v-model="searchValue"
        @change="getTableData"/>
    </div>
    <courses-table
      class="table"
      :tableConfig="tableConfig"
      :tableData="tableData">
      <template slot-scope="{ scope }">
        <div class="operator">
          <div class="item">
            <el-button type="text" @click="selVideo(scope.row)">选择</el-button>
          </div>
        </div>
      </template>
    </courses-table>
    <pagination
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :currentPage="page.pageCurrent"
      :pagination-config="paginationConfig"
    />
  </div>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
  import CoursesTable from '@/components/Table/coursesTable'
  import Pagination from '@/components/Table/pagination'

  import { searchVideo } from './api'
  export default {
    name: 'TeachVideo',
    components: {
      CoursesTable,
      Pagination
    },
    props: {
      chapterCont: {
        type: Object
      }
    },
    data() {
      return {
        form: {
          fileId: '',
          fileUrl: ''
        },
        selName: '',
        searchValue: '',
        tableData: [],
        tableConfig: {
          loading: false,
          serialNumber: {
            label: '序号',
            type: 'index',
            width: '64'
          },
          columnConfig: [
            {
              label: '课程名称',
              prop: 'name'
            }
          ]
        },
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        }
      }
    },
    computed: {
      cont() {
        return this.chapterCont[CHAPTER_CONT_TYPE.shipin].content || {}
      },
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        const params = {
          Text: this.searchValue,
          Offset: this.page.currentPage,
          Limit: this.page.pageSize
        }
        searchVideo(params).then(res => {
          this.tableConfig.loading = false
          this.tableData = res.data.mediaInfoSet.map(e => {
            return {
              fileId: e.fileId,
              fileUrl: e.basicInfo.mediaUrl,
              name: e.basicInfo.name
            }
          })
          this.page.totalCount = res.data.totalCount
        })
      },

      initData() {
        if (typeof this.cont === "string") {
          this.chapterCont[CHAPTER_CONT_TYPE.shipin].content = {
            fileId: '',
            fileUrl: '',
            fileName: ''
          }
        }
        this.form.fileId = this.cont.fileId || ''
        this.form.fileUrl = this.cont.fileUrl || ''
        this.selName = this.cont.fileName || ''
      },
      selVideo(data) {
        this.selName = data.name
        if (!this.chapterCont[CHAPTER_CONT_TYPE.shipin].content) {
          this.chapterCont[CHAPTER_CONT_TYPE.shipin].content = {
            fileId: data.fileId,
            fileUrl: data.fileUrl,
            fileName: data.name
          }
        } else {
          this.cont.fileId = data.fileId
          this.cont.fileUrl = data.fileUrl
          this.cont.fileName = data.name
        }
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.getTableData()
      }
    }
  }
</script>

<style scoped lang="scss">
  .form {
    margin: 24px;
    /deep/ .el-form-item {
      .el-form-item__label {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 24px;
      }
      .el-input {
        width: auto;
      }
    }
  }
  .header-bar {
    display: flex;
    height: 60px;
    line-height: 60px;
    justify-content: space-between;
    padding: 0 20px;
    .course-name {
      font-size: 18px;
      .sel-course {
        color: #3f93db;
      }
    }
    .search {
      width: 250px;
    }
  }
</style>
