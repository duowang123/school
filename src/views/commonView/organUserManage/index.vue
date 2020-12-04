<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="primary" @click="handlerExport()">导出</el-button>
        </el-form-item>
        <div>
          <el-form-item v-if="organType === 2">
            <el-select
              class="organ-select"
              v-model="organId"
              @change="organChange"
              clearable
              filterable
              placeholder="机构"
            >
              <el-option
                v-for="item in organList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="params.name" prefix-icon="el-icon-search" @change="getTableData" placeholder="用户名/姓名"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content-container">
      <courses-table
        class="table"
        :tableConfig="tableConfig"
        :tableData="tableData"
        :colWidth="{ opear: '140px' }"
      >
        <div slot-scope="{ scope }" style="width:200px">
          <!--          <el-button class="opr" type="text" @click="handleEdit(scope.row)">编辑</el-button>-->
          <!--          <el-button class="opr" type="text" @click="handleAttr(scope.row)">详情</el-button>-->
          <!--          <el-button class="opr" type="text" v-all @click="handleDelete(scope.row)">删除</el-button>-->
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
          <el-popover placement="left" width="150">
            <div style="text-align: right; margin: 0">
              <div class="icon-item" @click="handlePWD(scope.row)">
                <el-button type="text">重置密码</el-button>
              </div>
              <div
                v-if="scope.row.statusId === 1"
                class="icon-item"
                @click="handleDisable(scope.row)"
              >
                <el-button type="text">禁用</el-button>
              </div>
              <div v-else class="icon-item" @click="handleEnable(scope.row)">
                <el-button type="text">启用</el-button>
              </div>
              <div class="icon-item" @click="handleDelete(scope.row)">
                <el-button type="text">删除</el-button>
              </div>
            </div>
            <el-button slot="reference" type="text">更多</el-button>
          </el-popover>
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
      title="属性"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      :before-close="() => drawer = false"
    >
      <div class="drawer-content">
        <div class="content-row">
          <div class="title">用户名</div>
          <div class="cont">{{ currentRole.userName }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近登录时间</div>
          <div class="cont">{{ currentRole.lastLoginDate }}</div>
        </div>
        <div class="content-row">
          <div class="title">最近更新时间</div>
          <div class="cont">{{ currentRole.gmtModified }}</div>
        </div>
        <div class="content-row">
          <div class="title">更新人</div>
          <div class="cont">{{ currentRole.updateUserName }}</div>
        </div>
        <div class="content-row">
          <div class="title">创建人</div>
          <div class="cont">{{ currentRole.createUserName }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :title="userDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div style="height: 500px">
        <add-user-from ref="addUserFrom" :is-add="isAdd" :organType="organType" :user="addUser" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as api from '@/api/organ'
import addUserFrom from '../addOrganUser'
import coursesTable from '@/components/Table/coursesTable'
import pagination from '@/components/Table/pagination'
import tableMixin from '@/components/Table/tableMixin'
import download from '@/views/mixins/download'
export default {
  components: {
    addUserFrom,
    coursesTable,
    pagination
  },
  mixins: [tableMixin, download],
  name: 'HeadquartersUserManage',
  props: {
    organType: {
      type: Number,
      default: 1, // 总院： 1, 分院： 2
    },
  },
  data() {
    const vm = this
    return {
      isAdd: true,
      organList: [],
      roles: [],
      dialogVisible: false,
      addUser: {},
      drawer: false,
      currentRole: {},
      organId: '1',
      userDialogTitle: '新增用户',
      params: {
        name: '',
        order: 'asc',
        orderField: 'id',
      },
      tableData: [],
      tableConfig: {
        loading: false,
        // headerCellStyle: { background: '#F3F4F7', color: '#333333' },
        serialNumber: {
          label: '序号',
          type: 'index',
          width: '64',
          align: 'center'
        },
        columnConfig: [
          {
            label: '用户名',
            prop: 'userName',
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
            label: '职称',
            prop: 'title',
            type: 'enums',
            enums: (value) => {
              return value === '1'
                ? '高级讲师'
                : value === '2'
                ? '讲师'
                : '助教'
            },
          },
          {
            label: '角色',
            prop: 'roleName',
          },
          {
            label: '状态',
            prop: 'statusId',
            type: 'enums',
            enums: (value) => {
              return value === 1 ? '启用' : '禁用'
            },
          },
          {
            label: '机构名称',
            prop: 'organName',
          },
          {
            label: '机构性质',
            prop: 'property',
            type: 'enums',
            enums: (value) => {
              return value && value === '1' ? '学校' : '教学点'
            },
          },
          {
            label: '联系电话',
            prop: 'mobile',
          },
          {
            label: '邮箱',
            prop: 'email',
          },
        ],
      },
      map: {},
      formData: {},
      lecturerExt: {},
      ctrl: {
        loading: false,
        dialogVisible: false,
        proportionDialogVisible: false,
        viewVisible: false,
      },
      opts: {
        statusIdList: [],
      },
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    resetUser() {
      this.addUser = {
        organId: '',
        address: '',
        email: '',
        job: '',
        mobile: '',
        phone: '',
        pictureUrl: '',
        realName: '', // 姓名
        record: '', // 学历
        roleId: [],
        sex: '1',
        title: '',
        university: '',
        userName: '', // 用户名
        property: '',
      }
    },
    async init() {
      if (this.organType === 2) {
        const res = await api.getOrganChild({ name: '' })
        const all = {
          id: '',
          name: '全部',
          oldName: '全部',
        }
        this.organList = [all, ...(res.data.list || [])]
        this.organId = ''
        // this.organId = this.$_getValue(res.data, 'list.0.id', '')
      }
      this.resetUser()
      this.getTableData()
    },
    organChange() {
      this.getTableData()
    },
    getTableData() {
      const params = {
        ...this.params,
        organId: this.organId,
        pageCurrent: this.page.pageCurrent,
        pageSize: this.page.pageSize,
      }
      api.getUserList(params).then((res) => {
        this.tableData = res.data.rows
        this.page.totalCount = res.data.totalCount
        this.page.totalPage = res.data.totalPage
      })
    },
    handleAttr(data) {
      this.currentRole = data
      this.drawer = true
    },
    handleAdd() {
      this.isAdd = true
      this.resetUser()
      this.userDialogTitle = '新增用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addUserFrom && this.$refs.addUserFrom.clearValidate()
        if (this.organType === 2) {
          this.$refs.addUserFrom && this.$refs.addUserFrom.setRules()
        }
      })
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
        '/system/pc/sys/user/export',
        'POST',
        '用户管理',
        'xls'
      )
    },
    submit() {
      this.$refs.addUserFrom.validate((valid) => {
        console.log(valid)
        if (!valid) {
          return void '验证失败'
        }
        if (this.isAdd) {
          this.addSave()
        } else {
          this.updateSave()
        }
      })
    },
    addSave() {
      this.dialogVisible = false
      this.addUser.roleId = this.addUser.roleId.join(',')
      api.addUser(this.addUser).then((res) => {
        console.log(res)
        if (res.data === 1) {
          this.$message({
            message: '添加成功',
            type: 'success',
          })
          this.resetUser()
          this.getTableData()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error',
          })
        }
      })
    },
    updateSave() {
      this.dialogVisible = false
      this.addUser.roleId = this.addUser.roleId.join(',')
      api.updateUser(this.addUser).then((res) => {
        if (res.data === 1) {
          this.$message({
            message: '更新成功',
            type: 'success',
          })
          this.resetUser()
          this.getTableData()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error',
          })
        }
      })
    },
    // 修改跳页面操作
    handleEdit(user) {
      this.addUser = this.resetUser()
      this.userDialogTitle = '编辑用户'
      this.addUser = this.$_cloneDeep(user)
      this.isAdd = false
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.pageCurrent = val
      this.getTableData()
      // console.log(`当前页: ${val}`)
    },
    handlePWD({ id }) {
      this.$confirm(
        '重置密码后为<strong>“CZ+手机号后6位”</strong>，是否继续密码重置？',
        '提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        api.resetUserPwd({ id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '重置密码成功',
              type: 'success',
            })
            this.getTableData()
          } else {
            this.$message({
              message: '重置密码失败',
              type: 'error',
            })
          }
        })
      })
    },
    handleDisable({ id }) {
      this.$confirm('是否继续禁用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.resetUserDisable({ id }).then((res) => {
          if (res.data === 1) {
            this.$message({
              message: '禁用成功',
              type: 'success',
            })
            this.getTableData()
          } else {
            this.$message({
              message: '禁用失败',
              type: 'error',
            })
          }
        })
      })
    },
    handleEnable({ id }) {
      api.resetUserEnable({ id }).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '启用成功',
            type: 'success',
          })
          this.getTableData()
        } else {
          this.$message({
            message: '启用失败',
            type: 'error',
          })
        }
      })
    },
    handleDelete({ id }) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.resetUserDelete({ id }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getTableData()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            })
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.headquarters-user-manage {
  .user-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #f3f5f7;
    .organ-select {
      // margin-right: 24px;
      /deep/ .el-select {
        width: 256px;
      }
    }
  }
}
.drawer-content {
  .content-row {
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
.iconfont {
  margin-right: 10px;
}
</style>
