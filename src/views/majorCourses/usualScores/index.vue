<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true" >
        <el-form-item>
          <!--          <el-button type="primary" @click="addTransaction">新增</el-button>-->
        </el-form-item>
        <div class="organ-box">
          <el-select class="organ-select" v-model="organId" @change="organChange" filterable placeholder="请选择合作单位">
            <el-option
              v-for="item in organList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model.trim="params.queryContent" @change="organChange" placeholder="姓名/身份证号/学号"></el-input>
          <div class="search-btn" @click="superSearch()">
            <svg-icon icon-class="search"/>
          </div>
        </div>
      </el-form>
    </div>
    <div>
      <courses-table
        class="table"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '90px' }"
      >
      </courses-table>
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="page.pageCurrent"
        :pagination-config="paginationConfig"
      />
    </div>
    <component
      :is="componentName"
      :dialogVisible.sync="searchdialogVisible"
      @closeDia="closeDia"
      :organId="organId"
      v-if="componentName === 'search'"
    />
  </div>
</template>
<script>
  import coursesTable from '@/components/Table/coursesTable'
  import pagination from '@/components/Table/pagination'
  import organMixin from '@/views/mixins/organMixin'
  import * as api from '../api'
  import search from '@/components/search'
  export default {
    name: 'ManagePayable',
    mixins: [organMixin],
    components: {
      coursesTable,
      pagination,
      search
    },
    data() {
      const vm = this
      return {
        params: {
          schoolYear: null,
          queryContent: null
        },
        page: {
          pageCurrent: 1,
          pageSize: 10,
          totalCount: 0,
          totalPage: 0
        },
        tableData: [],
        tableConfig: {
          loading: false,
          isHideOperation: true,
          headerCellStyle: { background: '#F3F4F7', color: '#333333' },
          serialNumber: {
            label: '序号',
            type: 'index',
            width: '50'
          },
          columnConfig: [
            {
              label: '学号',
              prop: 'studentNo'
            },
            {
              label: '姓名',
              prop: 'realName'
            },
            {
              label: '专业',
              prop: 'specialtyName'
            },
            {
              label: '层次',
              prop: 'level',
              type: 'enums',
              enums: value => {
                return vm.levelOption.filter(
                  item => item.value === value
                )[0].label
              }
            },
            {
              label: '课程',
              prop: 'courseName'
            },
            {
              label: '学年',
              prop: 'schoolYear'
            },
            {
              label: '学期',
              prop: 'semesterLabel'
            },
            {
              label: '学分',
              prop: 'courseCredit'
            },
            {
              label: '本学期平时成绩',
              prop: 'dailyPerf'
            },
            {
              label: '学习时长占比',
              prop: 'propLearnTime'
            },
            {
              label: '提交作业/章节数',
              prop: 'submitJobNum',
              width: '100'
            },
            {
              label: '未做作业/章节数',
              prop: 'unSubmitJobNum',
              width: '100'
            },
            {
              label: '章节成绩',
              prop: 'chapterAchieve'
            },
            {
              label: '最近更新时间',
              prop: 'updateDate',
              width: '150'
            }
          ]
        },
        schoolYearOptions: [],
        semesterOptions: [],
        levelOption: [],
        componentName: '',
        searchdialogVisible: false
      }
    },
    computed: {
      // ...mapGetters(['organList']),
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    created() {
      this.initSelectOptions()
    },
    methods: {
      closeDia(params, flag) {
        this.getTableData(params)
      },
      // 高级搜索
      superSearch() {
        this.componentName = 'search'
        this.searchdialogVisible = true
      },
      getTableData(superParams = null) {
        const params = {
          ...this.params,
          organId: this.organId,
          pageCurrent: this.page.pageCurrent,
          pageSize: this.page.pageSize
        }
        if (superParams) {
          for (const key in superParams) {
            if (superParams[key] && superParams[key].length > 0) {
              params[key] = superParams[key]
            }
          }
        }
        api.studentDailyPerf(params).then(res => {
          this.tableData = this.formatData(res.data.rows)
          this.page.totalCount = res.data.totalCount
          this.page.totalPage = res.data.totalPage
        })
      },
      // 处理表格需要转换的数据
      formatData(data) {
        return data
      },
      // 从字典中获取下拉框数据
      initSelectOptions() {
        api.listByCode({ code: '0006' }).then(res => {
          this.levelOption = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({ code: '0024' }).then(res => {
          this.semesterOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.listByCode({code: '0014'}).then(res => {
          this.schoolYearOptions = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
      },
      organChange() {
        this.getTableData()
      },

      handleSizeChange(val) {
        this.page.pageSize = val
        this.init()
      },
      handleCurrentChange(val) {
        this.page.pageCurrent = val
        this.init()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .student-plan-right {
    .user-form {
      padding-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      /deep/ .el-form .el-input,
      .el-form .el-select,
      .el-form .el-textarea {
        width: 240px !important;
      }
      /deep/ .el-select {
        width: 256px !important;
      }
      /deep/ .el-select-dropdown {
        width: 256px !important;
      }
      /deep/ .el-input {
        width: 240px !important;
      }
      .organ-box {
        display: flex;
        justify-content: flex-end;
      }
      .organ-select {
        /deep/ .el-select {
          width: 256px;
        }
      }
      /deep/ .selectWidth {
        width: 156px !important;
        margin-right: 10px;
        .el-input {
          width: 156px !important;
        }
      }
    }
    /*.demo-drawer__footer{*/
    /*  text-align: center;*/
    /*  position: absolute;*/
    /*  bottom: 20px;*/
    /*  left: 20px;*/
    /*}*/
    .search-btn {
      cursor: pointer;
      width: 50px;
      background-color: #e6e6e6;
      border-radius: 5px;
      text-align: center;
      line-height: 40px;
      margin-left: 20px;
    }
  }

  .iconfont {
    margin-right: 10px;
  }
</style>
