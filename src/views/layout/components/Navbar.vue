<template>
  <div class="navbar-container">
    <div class="navbar">
      <div style="height: 64px">
        <!--      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>-->
        <sys-tab-bars />
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <i class="user-avatar iconfont icon-user" />
            <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <!--          <router-link class="inlineBlock" to="/">-->
            <!--            <el-dropdown-item>-->
            <!--              首页-->
            <!--            </el-dropdown-item>-->
            <!--          </router-link>-->
            <el-dropdown-item>
              <span style="display:block;" @click="$refs.pass.dialog = true">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <breadcrumb class="breadcrumb" />
      <updatePass ref="pass" @logout="logout" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SysTabBars from '@/components/SysTabbars'
import UpdatePass from './updatePass'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SysTabBars,
    UpdatePass,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      const schoolList = sessionStorage.removeItem('schoolList')
      const teacherList = sessionStorage.removeItem('teacherList')
      const schoolOrgansList = sessionStorage.removeItem('schoolOrgansList')
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar-container {
  position: fixed;
  top: 0;
  left: 210px;
  right: 0;
  z-index: 1002;
}
.navbar {
  position: relative;
  height: 64px;
  line-height: 64px;
  background-color: #3f93db;
  color: #fff;
  box-shadow: 8px 4px 8px 0 rgba(0, 11, 30, 0.12);
  /deep/ .el-tabs__active-bar {
    border-bottom: 3px solid #fff;
  }
  .hamburger-container {
    line-height: 64px;
    height: 58px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .breadcrumb {
    position: absolute;
  }
  .avatar-container {
    height: 64px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      height: 64px;
      line-height: 64px;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        font-size: 36px;
        color: #fff;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>

