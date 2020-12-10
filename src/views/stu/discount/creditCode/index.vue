<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <div class="organ-box">
            <el-select
              class="organ-select"
              v-model="params.organId"
              filterable
              v-if="showSchool"
              clearable
              @change="getTableData"
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
              v-if="showTeacher"
              lsSchool
              clearable
              @change="getTableData"
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
              prefix-icon="el-icon-search"
              @keyup.enter.native="init"
              placeholder="姓名/证件号码/学号"
            ></el-input>
            <!-- <div class="search-btn" @click="superSearch()"> -->
            <!-- <svg-icon icon-class="search" /> -->
            <!-- </div> -->
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table
          class="table"
          :tableConfig="tableConfig"
          :tableData="tableData"
          @btnTxt="btnTxt"
        >
          <div slot-scope="{ scope }" style="width:200px">
            <span class="opr" v-all @click="handleApply(scope.row)">审核</span>
          </div>
        </courses-table>
        <pagination
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          :currentPage="page.pageCurrent"
          :pagination-config="paginationConfig"
        />
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
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
import * as api from '../api'
import search from '@/components/search'
import ScanText from '../../schoolroll/component/scanText'
import add from './add'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'StudentTransaction',
  components: {
    coursesTable,
    pagination,
    search,
    ScanText,
    add
  },
  mixins: [selectMixin],
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
      courseTypeList: [],
      noTestTypeList: [],
      levelList: [],
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
      addData: {},
      currentData: {},
      tableData: [],
      tableConfig: {
        loading: false,
        // headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64'
        },
        columnConfig: [
          {
            label: '学校',
            prop: 'organName',
            width: '170'
          },
          {
            label: '学号',
            prop: 'studentNo',
            width: '160'
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
            label: '年级',
            prop: 'schoolYear'
          },
          {
            label: '专业',
            prop: 'professionalName',
            width: '160'
          },
          {
            label: '类型',
            prop: 'noTestType',
            type: 'enums',
            enums: (value) => {
              return vm.noTestTypeList.filter(
                (item) => item.dictValue === '1'
              )[0].dictName
            }
          },
          {
            label: '层次',
            prop: 'enterLevel',
            type: 'enums',
            enums: (value) => {
              return vm.levelList.filter((item) => item.dictValue === value)[0]
                .dictName
            }
          },
          {
            label: '减免学分',
            prop: 'money'
          },
          {
            label: '减免金额',
            prop: 'money'
          },
          {
            label: '减免原因',
            prop: 'saleReason',
            type: 'enums',
            enums: (value) => {
              return vm.courseTypeList.filter(
                (item) => item.dictValue === value
              )[0].dictName
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
            label: '财务确认状态',
            prop: 'cfApproveStatus',
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
            label: '确认时间',
            prop: 'approveDate',
            width: '160px'
          },
          {
            label: '确认人',
            prop: 'cfApproveUserName'
          },
          {
            label: '教学点',
            prop: 'schoolOrganName',
            width: '170'
          }
        ]
      },
      title: '学分优惠审核',
      componentName: '',
      componentData: null,
      width: '500px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      changePictureUrl: '',
      rowData: {}
    }
  },
  async created() {
    try {
      await this.getCodeList()
      this.getTableData()
    } catch (err) {
      console.log(err)
      this.tableData = []
    }
  },

  methods: {
    getOrganId(item) {
      this.initPage()
      this.getTableData({ organId: item.id })
    },
    async getCodeList() {
      const result1 = (await api.getSysDictList({ code: '0027' })) || {}
      this.noTestTypeList = result1.data || []
      this.levelList =
        ((await api.listByCode({ code: '0015' })) || {}).data || []
      const result2 = (await api.getSysDictList({ code: '0030' })) || {}
      this.courseTypeList = result2.data || []
    },
    async init() {
      this.params.queryContent = ''
      this.initPage()
      this.getTableData()
    },
    closeDia(params, flag) {
      this.dialogVisible = flag
    },
    // 高级搜索
    superSearch() {
      this.dialogVisible = true
      this.componentName = 'search'
    },
    // 查看
    btnTxt(row) {
      this.changePictureUrl = row.changePictureUrl
      this.componentName = 'ScanText'
      this.dialogVisible = true
    },
    // 优惠申请
    handleApply(row) {
      if (row.approveStatus !== '1') { return this.$message.warning('学分优惠审核只能操作待审核的!') }
      this.componentData = row
      this.componentName = 'add'
      this.dialogVisible = true
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page
      }
      const res = await api.cfPageList(params)
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
        // api.studentDelete({ id: row.id }).then(res => {
        // if (res.code === 200) {
        // this.$message({
        // type: 'success',
        // message: '删除成功!'
        // })
        // this.initPage()
        // this.getTableData()
        // }
        // })
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
    justify-content: flex-end;
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
.stu-info-title {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}
.stu-info-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  height: 88px;
  padding: 16px;
  margin-bottom: 24px;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #666666;
    margin-bottom: 8px;
  }
  .cont {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
  }
}
/deep/ .el-form-item__label {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
}
</style>
<style lang="scss">
.drawer-content-custom /deep/ .el-drawer__body {
  overflow: auto;
  overflow-x: hidden;
}
</style>
