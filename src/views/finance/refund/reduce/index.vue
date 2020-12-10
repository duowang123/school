<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!--          <el-button type="primary" @click="addTransaction">新增</el-button>-->
        </el-form-item>
        <div class="organ-box">
          <el-select
            class="organ-select"
            v-if="showSchool"
            clearable
            filterable
            v-model="params.organId"
            @change="organChange"
            placeholder="请选择学校"
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
            filterable
            clearable
            v-if="showTeacher"
            lsSchool
            @change="organChange"
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
            @change="organChange"
            placeholder="姓名/证件号码/学号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '140px' }"
      >
        <template slot-scope="{ scope }">
          <div class="item">
            <el-button type="text" @click="handleAttr(scope)">属性</el-button>
            <el-button v-all type="text" @click="handleApply(scope)">优惠申请</el-button>
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
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="dialogVisible"
      :size="width"
      :direction="direction"
    >
      <component :is="componentName" :ref="componentName" :data="componentData" />
      <div v-show="isShowBtn" class="demo-drawer__footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import ImgList from '@/components/ImgList'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import organMixin from '@/views/mixins/organMixin'
import * as api from '../api'
import Add from './add'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'RefundPayback',
  mixins: [organMixin, selectMixin],
  components: {
    ImgList,
    coursesTable,
    pagination,
    Add,
    Attr
  },
  data() {
    const vm = this
    return {
      params: {
        organId: '',
        realNameOrcertNo: '',
        schoolOrganId: ''
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '50'
        },
        columnConfig: [
          {
            label: '学校',
            prop: 'organName',
            width: '170'
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
            label: '学生类型',
            prop: 'studentType'
          },
          {
            label: '专业',
            prop: 'professionalName'
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.levelOption.filter(
                (item) => item.dictValue === value
              )[0].dictName
            }
          },
          {
            label: '学年',
            prop: 'schoolYear'
          },
          {
            label: '减免原因',
            prop: 'saleReason',
            type: 'enums',
            enums: (value) => {
              return vm.saleReasonOption.filter(
                (item) => item.dictValue === value
              )[0].dictName
            }
          },
          {
            label: '减免金额',
            prop: 'money'
          },
          {
            label: '申请时间',
            prop: 'applicationDate'
          },
          {
            label: '确认人',
            prop: 'cfApproveUserName'
          },
          {
            label: '确认时间',
            prop: 'cfApproveDate'
          },
          {
            label: '财务确认状态',
            prop: 'cfApproveStatus',
            width: '110',
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
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170'
          }
        ]
      },
      levelOption: [],
      returnTypeList: [],
      saleReasonOption: [],
      dialogVisible: false,
      title: '',
      width: '500px',
      componentName: '',
      componentData: {},
      direction: 'rtl',
      isShowBtn: true
    }
  },
  watch: {
    dialogVisible(val) {
      val || (this.componentName = '')
    }
  },
  created() {
    this.initSelectOptions()
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
  methods: {
    searchChange() {
      this.getList()
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
    getTableData() {
      const params = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize
      }
      api.getCreaditSaleApproveList(params).then((res) => {
        this.tableData = this.formatData(res.data.rows)
        this.tableData.forEach((obj) => {
          obj.studentType = '网教'
        })
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
      api.listByCode({ code: '0026' }).then((res) => {
        this.returnTypeList = res.data
      })
      api.listByCode({ code: '0006' }).then((res) => {
        this.levelOption = res.data
      })
      api.listByCode({ code: '0030' }).then((res) => {
        this.saleReasonOption = res.data
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
    },
    // 优惠申请
    handleApply({ row }) {
      if (row.cfApproveStatus !== undefined && row.cfApproveStatus !== '1') { return this.$message.warning('只能操作待审批!') }
      this.title = '优惠申请'
      this.componentData = row
      this.componentName = 'add'
      this.isShowBtn = true
      this.dialogVisible = true
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
          { label: '姓名', key: 'realName' },
          { label: '更新时间', key: 'approveDate' },
          { label: '更新人', key: 'approveUserName' }
        ]
      }
    },
    // 查看
    btnTxt(row) {
      this.title = '其他费用'
      this.dialogVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      this.componentData = {
        data: row,
        keys: [
          { label: '学号', key: 'studentNo' },
          { label: '姓名', key: 'realName' }
        ]
      }
    },
    handleDelete({ row }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteStudentPayback({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.init()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
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
    .organ-select {
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
  /deep/ .el-drawer__body {
    padding-bottom: 80px;
    overflow-y: auto !important;
  }
  .demo-drawer__footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .el-button {
      float: left;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
