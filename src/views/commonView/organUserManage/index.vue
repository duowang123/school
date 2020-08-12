<template>
  <div class="headquarters-user-manage pad20">
    <div>
      <el-form class="user-form" :inline="true" >
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <div>
          <el-form-item v-if="organType === 2">
            <el-select class="organ-select" v-model="organId" @change="organChange" clearable filterable placeholder="机构">
              <el-option
                  v-for="item in organList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input v-model.trim="params.name" @change="getTable" placeholder="用户名/姓名"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div>
      <el-table v-loading="ctrl.loading" size="medium" :data="list" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex === '1' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span>{{ scope.row.title === '1' ? '高级讲师' : scope.row.title === '2' ? '讲师': '助教' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.statusId === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <ul class="list-item-actions">
              <li class="opears">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleAttr(scope.row)">属性</el-button>
                <el-popover
                    placement="left"
                    width="150"
                >
                  <div style="text-align: right; margin: 0">
                    <div class="icon-item" @click="handlePWD(scope.row)">
                      <el-button type="text">重置密码</el-button>
                    </div>
                    <div v-if="scope.row.statusId === 1" class="icon-item" @click="handleDisable(scope.row)">
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
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <el-pagination
        background
        style="float: right;margin-top: 20px; margin-bottom: 22px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
    <el-drawer
        title="属性"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="() => drawer = false">
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
    <el-dialog :title="userDialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="70%">
      <div style="height: 500px">
        <add-user-from ref="addUserFrom" :is-add="isAdd" :user="addUser"/>
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
  import { mapGetters } from 'vuex'
  export default {
    components: { addUserFrom },
    name: 'HeadquartersUserManage',
    props: {
      organType: {
        type: Number,
        default: 1 // 总院： 1, 分院： 2
      }
    },
    data() {
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
          orderField: 'id'
        },
        list: [],
        map: {},
        formData: {},
        lecturerExt: {},
        ctrl: {
          loading: false,
          dialogVisible: false,
          proportionDialogVisible: false,
          viewVisible: false
        },
        opts: {
          statusIdList: []
        },
        page: {
          pageCurrent: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      resetUser() {
        this.addUser = {
          organId: this.organId || '1',
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
          userName: '' // 用户名
        }
      },
      async init() {
        if (this.organType === 2) {
          const res = await api.getOrganChild({ name: '' })
          this.organList = res.data.list || []
          this.organId = this.$_getValue(res.data, 'list.0.id', '')
        }
        this.resetUser()
        this.getTable()
      },
      organChange() {
        this.getTable()
      },
      getTable() {
        const params = {
          ...this.params,
          organId: this.organId,
          pageCurrent: this.page.pageCurrent,
          pageSize: this.page.pageSize
        }
        api.getUserList(params).then(res => {
          this.list = res.data.rows
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
        })
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
        api.addUser(this.addUser).then(res => {
          console.log(res)
          if (res.data === 1) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.resetUser()
            this.getTable()
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            });
          }
        })
      },
      updateSave() {
        this.dialogVisible = false
        this.addUser.roleId = this.addUser.roleId.join(',')
        api.updateUser(this.addUser).then(res => {
          if (res.data === 1) {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.resetUser()
            this.getTable()
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            });
          }
        })
      },
      // 修改跳页面操作
      handleEdit(user) {
        this.addUser = this.resetUser()
        this.userDialogTitle = '编辑用户'
        this.addUser = user
        this.isAdd = false
        this.dialogVisible = true
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`)
        this.page.pageSize = val
        this.getTable()
      },
      handleCurrentChange(val) {
        this.page.pageCurrent = val
        this.getTable()
        // console.log(`当前页: ${val}`)
      },
      handlePWD({ id }) {
        api.resetUserPwd({ id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '重置密码成功',
              type: 'success'
            });
            this.getTable()
          } else {
            this.$message({
              message: '重置密码失败',
              type: 'error'
            });
          }
        })
      },
      handleDisable({ id }) {
        api.resetUserDisable({ id }).then(res => {
          if (res.data === 1) {
            this.$message({
              message: '禁用成功',
              type: 'success'
            });
            this.getTable()
          } else {
            this.$message({
              message: '禁用失败',
              type: 'error'
            });
          }
        })
      },
      handleEnable({ id }) {
        api.resetUserEnable({ id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '启用成功',
              type: 'success'
            });
            this.getTable()
          } else {
            this.$message({
              message: '启用失败',
              type: 'error'
            });
          }
        })
      },
      handleDelete({ id }) {
        api.resetUserDelete({ id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getTable()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .headquarters-user-manage {
    .user-form {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .organ-select {
        margin-right: 24px;
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
        height:24px;
        font-size:14px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:24px;
      }
      .cont {
        height:24px;
        font-size:14px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:24px;
      }
    }
  }

  .icon-item {
    width: 100%;
    height: 40px;
    padding: 9px 16px;
    text-align: left;
    font-size:14px;
    font-weight:400;
    color: rgba(51,51,51,1);
    line-height:22px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .iconfont {
    margin-right: 10px;
  }
</style>
