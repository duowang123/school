<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <!-- <el-button type="primary" @click="handlerAdd()">新增</el-button> -->
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
        <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
          <div slot-scope="{ scope }">
            <span class="opr" v-all @click="handlerAdd(scope)">审核</span>
            <!-- <span class="opr" @click="handleDelete(scope)">删除</span> -->
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
    <component
      :is="componentName"
      :organId="params.organId"
      :dialogVisible="searchdialogVisible"
      @closeDia="closeDia"
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
import selectMixin from '@/views/mixins/select.js'

export default {
  name: 'studentTransaction',
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
    search,
  },
  mixins: [selectMixin],
  computed: {
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
  },
  data(vm) {
    return {
      organList: [],
      noTestTypeList: [],
      params: {
        organId: '',
        realNameOrcertNo: '',
        schoolOrganId: '',
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
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
          width: '64',
        },
        columnConfig: [
          {
            label: '学号',
            prop: 'testNo',
            width: '160',
          },
          {
            label: '姓名',
            prop: 'realName',
          },
          {
            label: '性别',
            prop: 'sex',
            type: 'enums',
            enums: (value) => {
              return value === '1' ? '男' : '女'
            },
          },
          {
            label: '合作单位',
            prop: 'organId',
            type: 'enums',
            width: '160',
            enums: (value) => {
              return vm.organList.filter((item) => item.id === value)[0].name
            },
          },
          {
            label: '年级',
            prop: 'schoolYear',
          },
          {
            label: '专业',
            prop: 'professionalName',
            width: '160px',
          },
          {
            label: '课程',
            prop: 'courseName',
          },
          {
            label: '类型',
            prop: 'noTestType',
            type: 'enums',
            enums: (value) => {
              return vm.noTestTypeList.filter(
                (item) => item.dictValue === value
              )[0].dictName
            },
          },
          {
            label: '申请时间',
            prop: 'applicationDate',
            width: '160px',
          },
          {
            label: '申请人',
            prop: 'applicationUserName',
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
            },
          },
          {
            label: '审核人',
            prop: 'approveUserName',
          },
          {
            label: '审核时间',
            prop: 'approveDate',
            width: '160px',
          },
        ],
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '552px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      searchdialogVisible: false,
    }
  },
  async created() {
    try {
      const res = await api.getRootAndChildOrgan({ name: '' })
      this.getCodeList()
      this.organList = res.data.list || []
      this.params.organId = this.organListAll[0].id
      this.params.schoolOrganId = this.schoolOrgansListAll[0].id
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
    async init() {
      this.initPage()
      this.getTableData()
    },
    async getCodeList() {
      const result1 = (await api.getSysDictList({ code: '0027' })) || {}
      this.noTestTypeList = result1.data || []
    },
    handlerAdd({ row }) {
      if (row.approveStatus !== '1')
        return this.$message.warning('免修免考审核只能操作待审核的!')
      this.title = '审核'
      this.componentData = row
      this.isShowBtn = true
      this.dialogVisible = true
      this.componentName = 'Add'
    },
    // 高级搜索
    superSearch() {
      this.dialogVisible = false
      this.searchdialogVisible = true
      this.componentName = 'search'
    },
    closeDia(params, flag) {
      console.log(params)
      this.searchdialogVisible = flag
      // this.initPage()
      // this.getTableData(params)
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
          { label: '姓名', key: 'type' },
          { label: '最近更新时间', key: 'createdTime' },
          { label: '更新人', key: 'approveUserName' },
          { label: '创建时间', key: 'major' },
          { label: '创建人', key: 'approveTime' },
        ],
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
        ...this.page,
        ...query,
      }
      const res = await api.getNoTestApprove(params)
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
        type: 'warning',
      }).then(() => {
        api.studentDelete({ id: row.id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
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
    },
  },
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
    margin: 24px;
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
