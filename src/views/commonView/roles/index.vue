<template>
  <div class="role-component">
    <div class="section-left">
      <div class="organ-select" v-if="organType !== 1">
        <el-select
          style="width: 100%"
          v-model="organId"
          @change="organChange"
          filterable
          placeholder="请选择"
        >
          <el-option v-for="item in organList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <p class="title">
        <span class="text">角色列表</span>
        <img @click="addRoleHandler" class="opear" src="@/assets/images/icon_add.png" />
      </p>
      <div>
        <ul class="role-list">
          <template v-for="role in roles">
            <div
              :key="role.id"
              @mouseenter="hoverRoleId = role.id"
              @mouseleave="hoverRoleId = ''"
              @click="getRoleMenuHandler(role)"
              class="role-item"
              :class="{'active': selRoleId===role.id}"
            >
              <li class="role-name">{{role.roleName}}</li>
              <div class="opear" v-show="hoverRoleId === role.id">
                <img
                  width="16"
                  height="16"
                  @click="updateRole(role)"
                  src="@/assets/images/icon-edit.png"
                  alt
                />
                <img
                  width="16"
                  height="16"
                  @click="deleteRole(role)"
                  src="@/assets/images/icon-delete.png"
                  alt
                />
              </div>
            </div>
          </template>
        </ul>
      </div>
    </div>
    <div class="section-content">
      <div class="title">
        <div>
          <span class="text">功能权限</span>
          <span>(包含总院功能)</span>
        </div>
        <el-button type="text" @click="updateMenuToRole">保存</el-button>
      </div>
      <div class="function-tree">
        <el-tree
          ref="tree"
          :data="menu"
          show-checkbox
          node-key="cpId"
          :default-checked-keys="defaultChecked"
          :props="defaultProps"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/organ'

export default {
  name: 'Roles',
  props: {
    organType: {
      type: Number,
      default: 1, // 总院： 1, 分院： 2
    },
  },
  data() {
    return {
      hoverRoleId: '',
      organList: [],
      organId: '1',
      selRoleId: '',
      roles: [],
      menu: [],
      defaultChecked: [],
      addRoleName: '',
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },
      nullValidator: (e) => {
        return !!e
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (this.organType === 2) {
        const res = await api.getOrganChild({ name: '' })
        this.organList = res.data.list || []
        this.organId = this.$_getValue(res.data, 'list.0.id', '')
      }
      // 获取角色列表
      this.getRoleList()
    },
    addRoleHandler() {
      this.$prompt('请输入角色名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.nullValidator,
        inputErrorMessage: '请输入不超过20字符长度的角色名称,',
        inputPattern: /^[\S\n\s]{1,20}$/,
      }).then(({ value }) => {
        this.addRoleToOrgan(value)
      })
    },
    getRoleList() {
      const params = {
        organId: this.organId,
      }
      api.getRoleFormOrgan(params).then((res) => {
        this.roles = res.data.organRESQS
        // 获取所有菜单
        this.roles[0] && this.getAllMenuHandler(this.roles[0])
      })
    },
    getAllMenuHandler(role = {}) {
      this.selRoleId = role.id
      api.getMenuFormRole({ roleId: role.id }).then((res) => {
        const data = res.data
        this.menu = data
        this.getCheckedId(data)
      })
    },
    // 获取角色下面的菜单权限
    getRoleMenuHandler(role) {
      this.getAllMenuHandler(role)
    },
    getCheckedId(menu) {
      const flArr = this.$_flattenObj(menu)
      const selId = flArr
        .filter((e) => e.select)
        .filter((e) => e.children.length === 0)
        .map((e) => e.cpId)
      this.defaultChecked = selId
    },
    addRoleToOrgan(roleName) {
      const params = {
        organId: this.organId,
        roleName: roleName,
      }
      api.addRole(params).then((res) => {
        console.log(res)
        if (res.data === 1) {
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success',
          })
          this.getRoleList()
        } else {
          this.$message({
            showClose: true,
            message: '删除失败: ' + res.msg,
            type: 'error',
          })
        }
      })
    },
    organChange() {
      this.getRoleList()
    },
    updateRole({ id, organId, roleName }) {
      this.$prompt('请输入角色名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: roleName,
        inputValidator: this.nullValidator,
        inputErrorMessage: '请输入角色名称',
      }).then(({ value }) => {
        api.updateRoleName({ id, organId, roleName: value }).then((res) => {
          if (res.data === 1) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success',
            })
            this.getRoleList()
          } else {
            this.$message({
              showClose: true,
              message: '修改失败:' + res.msg,
              type: 'error',
            })
          }
        })
      })
    },
    deleteRole({ id }) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.deleteRole({ id }).then((res) => {
          if (res.data === 1) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
            })
            this.getRoleList()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败:' + res.msg,
              type: 'error',
            })
          }
        })
      })
    },
    updateMenuToRole() {
      // TODO
      let menuId = this.$refs['tree'].getCheckedNodes(false, true)
      menuId = menuId.map((e) => e.cpId)
      // const menuId = this.$refs['tree'].getCheckedKeys()
      const roleId = this.selRoleId
      const params = {
        menuId,
        roleId,
      }
      api.saveMenuToRole(params).then((res) => {
        if (res.data === 1) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
        } else {
          this.$message({
            showClose: true,
            message: '保存失败:' + res.msg,
            type: 'error',
          })
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.role-component {
  height: 100%;
  width: 100%;
  display: flex;

  .section-left {
    flex: 0 0 288px;
    background-color: #ffffff;
    padding: 0;

    .organ-select {
      padding: 25px 16px 0 16px;
      width: 100%;
    }

    .title {
      padding: 0 24px;
      display: flex;
      height: 79px;
      line-height: 79px;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      border-bottom: 1px solid #D7E0E7;

      .text {
        margin-top: 6px;
        width: 64px;
        height: 24px;
        font-size: 16px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 24px;
      }

      .opear {
        width: 24px;
        height: 24px;
      }
    }

    .role-list {
      .role-item {
        display: flex;
        justify-content: space-between;
        padding-right: 24px;
        .role-name {
          height: 46px;
          line-height: 46px;
          padding: 0 24px;
          color: rgba(102, 102, 102, 1);
          font-size: 14px;
          /*background: rgba(255, 255, 255, 1);*/
          border-bottom: 1px solid #F5F7FA;
          cursor: pointer;
        }
        &.active {
          background: rgba(63, 147, 219, 0.08);
          color: #333333;
          font-weight: 600;
        }
        .opear {
          display: flex;
          align-items: center;
          img {
            margin-left: 6px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .section-content {
    margin: 24px;
    width: 100%;
    margin-top: 0;
    .title {
      display: flex;
      justify-content: space-between;
      margin: 0 0 22px 0;
      padding: 0 24px;
      height: 72px;
      line-height: 72px;
      border-bottom: 1px solid #D7E0E7;
      color: #9b9b9b;
      font-size: 16px;
      .text {
        font-size: 18px;
        color: #333333;
        margin-right: 6px;
      }
    }
    background-color: #ffffff;
    .function-tree {
      margin-left: 24px;
    }
  }
}
</style>
