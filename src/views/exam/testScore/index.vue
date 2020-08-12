<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerAdd()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              filterable
              v-model="params.organId"
              placeholder="请选择合作单位"
            >
              <el-option
                v-for="item in organList"
                :key="item.id"
                @click.native="getOrganId(item)"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="params.studentNoOrCertNo"
              prefix-icon="el-icon-search"
              @change="init"
              placeholder="学号/身份证号"
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData" :colWidth="{ opear: '140px' }">
        <div slot-scope="{ scope }" style="width:200px">
          <span class="opr" @click="handleEdit(scope)">编辑</span>
          <span class="opr" @click="handleAttr(scope)">详情</span>
          <span class="opr" @click="handleDelete(scope)">删除</span>
        </div>
      </courses-table>
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="page.pageCurrent"
        :pagination-config="paginationConfig"
      />
    </div>
    <el-drawer
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component :is="componentName" :ref="componentName" :data="componentData" />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import coursesTable from '@/components/Table/coursesTable'
  import pagination from '@/components/Table/pagination'
  import Attr from '@/components/Table/attr'
  import * as api from '../api'
  import { mapGetters } from 'vuex'
  import Add from './add.vue'

  export default {
    name: 'Index',
    components: {
      coursesTable,
      pagination,
      Attr,
      Add
    },
    computed: {
      ...mapGetters(['organList']),
      paginationConfig() {
        return {
          total: this.page.totalCount,
          pageSize: this.page.pageSize,
          pageSizes: [20, 50, 100, 200]
        }
      }
    },
    data(vm) {
      return {
        examPlanInfoList: [],
        examPlanProjectList: [],
        testTypeList: [],
        params: {
          organId: '',
          studentNoOrCertNo: ''
        },
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        },
        addData: {},
        currentData: {},
        tableData: [],
        tableConfig: {
          loading: false,
          headerCellStyle: { background: '#F3F4F7', color: '#333333' },
          serialNumber: {
            label: '序号',
            type: 'index',
            width: '64'
          },
          columnConfig: [
            {
              label: '考试计划',
              prop: 'planName'
            },
            {
              label: '计划项目',
              prop: 'projectName'
            },
            {
              label: '学号',
              prop: 'studentNo'
            },
            {
              label: '姓名',
              prop: 'realName'
            },
            {
              label: '课程',
              prop: 'courseName'
            },
            {
              label: '考试方式',
              prop: 'testType',
              type: 'enums',
              enums: value => {
                return vm.testTypeList.filter(
                  item => item.value === value
                )[0].label
              }
            },
            {
              label: '成绩',
              prop: 'testScore'
            },
            {
              label: '考试状态',
              prop: 'testStatus'
            }
          ]
        },
        title: '',
        componentName: '',
        componentData: null,
        width: '552px',
        direction: 'rtl',
        isShowBtn: true,
        dialogVisible: false
      }
    },
    async created() {
      try {
        this.params.organId = this.organList[0].id
        this.initSelectOptions()
        this.getTableData()
      } catch (err) {
        console.log(err)
        this.tableData = []
      }
    },
    watch: {
      dialogVisible(val) {
        val || (this.componentName = '')
      }
    },
    methods: {
      // 从字典中获取下拉框数据
      initSelectOptions() {
        api.listByCode({ code: '0019' }).then(res => {
          this.testTypeList = res.data.map(e => {
            return {
              id: e.id,
              label: e.dictName,
              value: e.dictValue
            }
          })
        })
        api.examPlanInfoList({}).then(res => {
          this.examPlanInfoList = res.data.map(t => {
            return {
              name: t.planName,
              value: t.id
            }
          })
        })
        api.listByOrganId({ organId: this.params.organId }).then(res => {
          this.examPlanProjectList = res.data.map(t => {
              return {
                name: t.projectName,
                value: t.id
              }
          })
        })
      },
      getOrganId(item) {
        this.initPage()
        this.getTableData({ organId: item.id })
      },
      handlerAdd() {
        this.dialogVisible = true
        this.title = '新增'
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          isAdd: true,
          organId: this.params.organId,
          examPlanInfoList: this.examPlanInfoList,
          examPlanProjectList: this.examPlanProjectList,
          testTypeList: this.testTypeList
        }
      },
      // 编辑
      handleEdit({ row }) {
        this.title = '编辑'
        this.dialogVisible = true
        this.componentName = 'Add'
        this.width = '450px'
        this.isShowBtn = true
        this.componentData = {
          ...row,
          isAdd: false,
          examPlanInfoList: this.examPlanInfoList,
          examPlanProjectList: this.examPlanProjectList,
          testTypeList: this.testTypeList
        }
      },
      async init() {
        this.initPage()
        this.getTableData()
      },
      // 属性
      handleAttr({ row }) {
        this.title = '属性'
        this.dialogVisible = true
        this.componentName = 'Attr'
        this.width = '450px'
        this.isShowBtn = false
        this.componentData = {
          data: row,
          keys: [
            { label: '学号', key: 'studentNo' },
            { label: '课程', key: 'courseName' },
            { label: '创建时间', key: 'createDate' },
            { label: '创建人', key: 'createUserName' },
            { label: '更新时间', key: 'updateDate' },
            { label: '更新人', key: 'updateUserName' }
          ]
        }
      },
      initPage() {
        this.page.pageCurrent = 1
      },
      async getTableData(query) {
        const params = {
          ...this.params,
          ...this.page
        }
        const res = await api.getTestScoreList(params)
        this.tableData = res.data.rows || []
        this.page.totalCount = res.data.totalCount
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.getTableData()
      },
      confirm() {
        this.$nextTick(() => {
          this.$refs[`${this.componentName}`].confirm((valid) => {
            this.dialogVisible = !valid
            if (valid) {
              this.init()
            }
          })
        })
      },
      // 删除
      handleDelete({ row }) {
        this.$confirm('是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteStudentTestScore({ id: row.id }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initPage()
              this.getTableData()
            }
          })
        })
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.getTableData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .student-plan-right {
    .user-form {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .organ-box {
        display: flex;
        justify-content: flex-end;
      }
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
      .organ-select {
        /deep/ .el-select {
          width: 256px;
        }
      }
    }
  }
  .icon-item {
    width: 100%;
    height: 40px;
    padding: 9px 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .student-plan-right /deep/ .el-drawer__wrapper /deep/ {
    .attrStyle /deep/ {
      margin: 24px 24px 0 24px;
      .title {
        height: 24px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 24px;
      }
      .cont {
        height: 24px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 24px;
      }
    }
  }
  .search-btn {
    cursor: pointer;
    margin-left: 20px;
  }
  .opr {
    color: #3f93db;
    cursor: pointer;
    display: inline-flex;
    margin-right: 5px;
  }
</style>
<style lang="scss">
  .drawer-content-custom /deep/ .el-drawer__body {
    overflow: auto;
    overflow-x: hidden;
  }
</style>