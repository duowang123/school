<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handlerExport()">导出</el-button>
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-model="params.organId"
            clearable
            filterable
            v-if="showSchool"
            placeholder="请选择学校"
            @change="getTableData()"
          >
            <el-option
              v-for="item in schoolOrgansListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            class="organ-select"
            v-model="params.schoolOrganId"
            clearable
            filterable
            @change="getTableData()"
            v-if="showTeacher"
            placeholder="请选择教学点"
          >
            <el-option
              v-for="item in organListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @keyup.enter.native="init"
            placeholder="姓名/证件号码/学号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
      >
        <template slot-scope="{ scope }">
          <span class="el-button--text" v-all @click="handlerEdit(scope.row)">异动审批</span>
        </template>
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
      :wrapperClosable="false"
      class="drawer-content drawer-content-custom"
    >
      <div class="drawer-container-box">
        <component
          :is="componentName"
          :ref="componentName"
          :data="componentData"
          :dialogVisible.sync="dialogVisible"
        />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import { mapGetters } from 'vuex'
import add from './add'
import scantext from './scantext'
import download from '@/views/mixins/download'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'StudentCode',
  components: {
    coursesTable,
    pagination,
    add,
    scantext
  },
  mixins: [download, selectMixin],
  data(vm) {
    return {
      params: {
        realNameOrcertNo: '',
        organId: '',
        schoolOrganId: ''
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      changeTypeList: [],
      changeReasonList: [],
      tableData: [],
      tableConfig: {
        loading: false,
        // headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '50'
        },
        columnConfig: [
          {
            label: '学号',
            prop: 'studentNo',
            width: '120'
          },
          {
            label: '姓名',
            prop: 'realName'
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '男' : '女'
            }
          },
          {
            label: '注册学校',
            prop: 'organName',
            width: '160px'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170'
          },
          {
            label: '层次',
            prop: 'levelName'
          },
          {
            label: '专业',
            prop: 'major'
          },
          {
            label: '异动次数',
            prop: 'changeNum'
          },
          {
            label: '异动类型',
            prop: 'changeType',
            type: 'enums',
            enums: (value) => {
              const arr = vm.changeTypeList.filter(
                (item) => item.dictValue === value
              )
              return arr.length ? arr[0].dictName : value
            }
          },
          {
            label: '异动原因',
            prop: 'changeReason',
            type: 'enums',
            enums: (value) => {
              if (!value) return value
              const valueArr = value.split(',')
              const arr = vm.changeReasonList.filter((item) =>
                valueArr.includes(item.dictValue)
              )
              let str = ''
              if (arr.length) {
                arr.forEach((element) => {
                  str = str + element.dictName + ','
                })
              }
              return str.substring(0, str.length - 1)
            }
          },
          {
            label: '扫描件',
            prop: '',
            slot: {
              type: 'btnTxt',
              txt: '查看'
            }
          },
          {
            label: '申请时间',
            prop: 'applicationDate',
            width: '160px'
          },
          {
            label: '申请人',
            prop: 'applicationUserName'
          },
          {
            label: '审核结果',
            prop: 'approveStatus',
            type: 'enums',
            enums: (value) => {
              // 审核状态，1待审批，2通过，3不通过
              if (!value) {
                return '--'
              }
              if (value === '1') {
                return '待审批'
              } else if (value === '2') {
                return '通过'
              } else {
                return '不通过'
              }
            }
          },
          {
            label: '审核人',
            prop: 'approveUserName'
          },
          {
            label: '审核时间',
            prop: 'approveDate',
            width: '160px'
          }
        ]
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '600px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      searchdialogVisible: false,
      organListAll: [],
      schoolOrgansListAll: []
    }
  },
  computed: {
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200]
      }
    },
    ...mapGetters(['organList', 'teacherList', 'schoolOrgansList']),
    isAll() {
      return this.$store.getters.userOrganId + '' === '1'
    },
    isSchool() {
      return (
        this.$store.getters.property && this.$store.getters.property === '1'
      )
    },
    isTeacher() {
      return (
        this.$store.getters.property && this.$store.getters.property === '2'
      )
    }
  },
  created() {
    const all = {
      id: '',
      name: '全部',
      oldName: '全部'
    }
    this.organListAll = [all, ...this.teacherList]
    this.schoolOrgansListAll = [all, ...this.schoolOrgansList]
    this.params.organId = this.organListAll[0].id
    api.getSysDictList({ code: '0021' }).then((res) => {
      this.changeTypeList = res.data || []
    })
    api.getSysDictList({ code: '0022' }).then((res) => {
      this.changeReasonList = res.data || []
    })
    this.init()
  },
  methods: {
    async getOrganId(item) {
      await this.initPage()
      this.getTableData({ organId: item.id })
    },
    async init() {
      await this.initPage()
      await this.getTableData()
    },
    // 查看
    btnTxt(row) {
      this.isShowBtn = false
      this.componentData = row
      this.componentName = 'scantext'
      this.dialogVisible = true
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    handlerExport() {
      const params = {
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...this.params
      }
      // TODO
      this.download(
        params,
        '/course/student_change_approve/export',
        'POST',
        '学籍异动审批',
        'xls'
      )
    },
    getTableData(query) {
      const obj = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query
      }
      api.verifyList(obj).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.init()
    },
    // 异动审批
    handlerEdit(row) {
      if (row.approveStatus !== '1') { return this.$message.warning('异动审批只操作待审核的!') }
      this.isShowBtn = true
      this.title = '异动审批'
      this.componentData = row
      this.componentName = 'add'
      this.dialogVisible = true
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
    background-color: #f3f5f7;
    .organ-box {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
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
.el-button--text {
  cursor: pointer;
}
</style>
