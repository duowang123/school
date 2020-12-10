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
              clearable
              v-if="showTeacher"
              lsSchool
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
              @change="getTableData"
              placeholder="姓名/证件号码/学号"
            ></el-input>
            <!-- <div class="search-btn" @click="superSearch()"> -->
            <!-- <svg-icon icon-class="search" /> -->
            <!-- </div> -->
          </div>
        </el-form-item>
      </el-form>
      <div class="main-content-container">
        <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
          <div slot-scope="{ scope }" style="width:200px">
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
        <component
          :is="componentName"
          :ref="componentName"
          :data="componentData"
          :dialogVisible="searchdialogVisible"
          @closeDia="closeDia"
        />
        <div v-show="isShowBtn" class="demo-drawer__footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <component
      :is="componentName"
      :dialogVisible="searchdialogVisible"
      @closeDia="closeDia"
      :organId="params.organId"
      v-if="componentName === 'search'"
    />
  </div>
</template>
<script>
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import Attr from '@/components/Table/attr'
import Add from './add'
import { userInfo } from '../mock.js'
import * as api from '../api'
import search from '@/components/search'
import { mapGetters } from 'vuex'
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'StudentTransaction',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
    search
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
            prop: 'money',
            width: '120px'
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
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      searchdialogVisible: false
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
    handlerAdd() {
      this.title = '学分优惠申请'
      this.isShowBtn = true
      this.dialogVisible = true
      this.componentName = 'Add'
      this.width = '552px'
    },
    // 高级搜索
    superSearch() {
      this.dialogVisible = false
      this.searchdialogVisible = true
      this.componentName = 'search'
    },
    closeDia(params, flag) {
      this.searchdialogVisible = flag
    },
    async init() {
      this.params.queryContent = ''
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
          { label: '姓名', key: 'realName' },
          { label: '申请时间', key: 'applicationDate' },
          { label: '更新人', key: 'approveUserName' },
          { label: '创建人', key: 'applicationUserName' }
        ]
      }
    },
    add() {
      this.tableData.push(...userInfo)
    },
    initPage() {
      this.page.pageCurrent = 1
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page
      }
      const res = await api.creditSaleList(params)
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
            this.componentName = ''
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
        api.studentApplyDelete({ id: row.id }).then((res) => {
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
