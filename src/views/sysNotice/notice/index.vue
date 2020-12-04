<template>
  <div class="student-plan-right pad20">
    <el-button type="primary" @click="handleAdd()" style="margin:0 20px 20px 0">新增</el-button>
    <div class="main-content-container">
      <courses-table class="table" :tableConfig="tableConfig" :tableData="tableData">
        <div slot-scope="{ scope }" style="width:200px">
          <span class="opr" @click="handleEdit(scope.row)">编辑</span>
          <span
              class="opr"
              @click="handleOn(scope.row)"
          >{{ scope.row.msgStatus === '1' ? '启用' : '禁用'}}</span>
          <span class="opr" @click="handleAttr(scope.row)">属性</span>
          <span class="opr" @click="handleDelete(scope.row)">删除</span>
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
      destroy-on-close
      :direction="direction"
      :wrapperClosable="false"
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
import Add from './add'
import * as api from '../api'

export default {
  components: {
    coursesTable,
    pagination,
    Attr,
    Add,
  },
  computed: {
    paginationConfig() {
      return {
        total: this.page.totalCount,
        pageSize: this.page.pageSize,
        pageSizes: [20, 50, 100, 200],
      }
    },
  },
  data() {
    return {
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
      tableData: [],
      tableConfig: {
        loading: false,
        headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64',
        },
        columnConfig: [
          {
            label: '标题',
            prop: 'title',
          },
          {
            label: '更新时间',
            prop: 'updateDate',
          },
          {
            label: '更新人',
            prop: 'updateUserName',
          },
        ],
      },
      title: '',
      componentName: '',
      componentData: null,
      width: '80%',
      direction: 'rtl',
      isShowBtn: true,
      dialogVisible: false,
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    initPage() {
      this.page.pageCurrent = 1
    },
    init() {
      this.initPage()
      this.getTableData()
    },
    async getTableData(query) {
      const params = {
        ...this.params,
        ...this.page,
      }
      const res = await api.sysMessage(params)
      this.tableData = res.data.rows || []
      this.page.totalCount = res.data.totalCount
    },
    handleAttr(row) {
      this.title = '属性'
      this.dialogVisible = true
      this.componentName = 'Attr'
      this.width = '450px'
      this.isShowBtn = false
      this.componentData = {
        data: row,
        keys: [
          { label: '创建名称', key: 'title' },
          { label: '创建时间', key: 'createDate' },
          { label: '创建人', key: 'createUserName' },
          { label: '更新时间', key: 'updateDate' },
          { label: '更新人', key: 'updateUserName' },
        ],
      }
    },
    handleEdit(row) {
      this.title = '编辑'
      this.componentData = this.$_cloneDeep(row)
      this.componentName = 'Add'
      this.dialogVisible = true
    },
    handleAdd() {
      this.title = '新增'
      this.componentData = {}
      this.componentName = 'Add'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.title = '编辑'
      this.componentData = row
      this.componentName = 'Add'
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.init()
    },
    handleOn({ msgStatus, id }) {
      if (msgStatus === '2') {
        api.sysClose({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('禁用成功!')
            this.init()
          } else {
            this.$message.success('禁用失败!')
          }
        })
      } else {
        api.sysOpen({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('启用成功!')
            this.init()
          } else {
            this.$message.success('启用失败!')
          }
        })
      }
    },
    handleDelete({ id }) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.sysDelete({ id }).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
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
