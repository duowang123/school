<template>
  <div class="student-plan-right pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <div class="organ-box">
          <el-select class="organ-select" filterable v-model="params.organId" placeholder="请选择合作单位">
            <el-option
              v-for="item in organList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click.native="getOrganId(item)"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="params.realNameOrcertNo"
            @keyup.enter.native="init"
            placeholder="姓名/身份证号"
          ></el-input>
        </div>
      </el-form>
    </div>
    <div>
      <courses-table
        class="table"
        @btnTxt="btnTxt"
        :tableConfig="tableConfig"
        :tableData="tableData"
      >
        <template slot-scope="{ scope }">
          <span class="el-button--text" @click="handlerEdit(scope.row)">异动审批</span>
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

export default {
  name: 'StudentCode',
  components: {
    coursesTable,
    pagination,
    add,
    scantext,
  },
  data(vm) {
    return {
      params: {
        realNameOrcertNo: '',
        organId: '',
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      changeTypeList: [],
      changeReasonList: [],
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '50',
        },
        columnConfig: [
          {
            label: '学号',
            prop: 'studentNo',
            width: '120',
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
            }
          },
          {
            label: '注册学校',
            prop: 'organName'
          },
          // {
          //   label: '合作单位',
          //   prop: 'organId',
          //   type: 'enums',
          //   width: '160',
          //   enums: (value) => {
          //     return vm.organList.filter((item) => item.id === value)[0].name
          //   },
          // },
          {
            label: '异动次数',
            prop: 'changeNum',
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
            },
          },
          {
            label: '异动原因',
            prop: 'changeReason',
            type: 'enums',
            width: '170px',
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
            },
          },
          {
            label: '扫描件',
            prop: '',
            slot: {
              type: 'btnTxt',
              txt: '查看',
            },
          },
          {
            label: '申请时间',
            prop: 'applicationDate',
            width: '170px',
          },
          {
            label: '申请人',
            prop: 'applicationUserName',
            width: '200px',
          },
          {
            label: '审核结果',
            prop: 'approveStatus',
            width: '120px',
            type: 'enums',
            enums: (value) => {
              // 审核状态，1待审批，2通过，3不通过
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
            width: '200px',
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
      width: '600px',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
      searchdialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['organList']),
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
    ...mapGetters(['organList']),
  },
  created() {
    this.init()
  },
  methods: {
    async getOrganId(item) {
      await this.initPage()
      this.getTableData({ organId: item.id })
    },
    async init() {
      this.params.organId = this.organList[0].id
      const result1 = (await api.getSysDictList({ code: '0021' })) || {}
      const result2 = (await api.getSysDictList({ code: '0022' })) || {}
      this.changeTypeList = result1.data || []
      this.changeReasonList = result2.data || []
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
    getTableData(query) {
      const obj = {
        ...this.params,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
        ...query,
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
      if (row.approveStatus !== '1')
        return this.$message.warning('异动审批只操作待审核的!')
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
    },
  },
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
      margin-bottom: 24px;
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
