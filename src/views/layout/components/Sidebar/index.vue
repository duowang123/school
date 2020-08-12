<template>
  <el-scrollbar class="sidebar-container" wrap-class="scrollbar-wrapper">
    <div class="logo">
      <img width="31" height="31" src="@/assets/images/logo-nav.png" alt="">
      <span class="text">教学管理平台</span>
    </div>
    <el-menu
      class="sidebar-menu"
      :show-timeout="200"
      :default-active="$route.path"
      mode="vertical"
      router
      background-color="#3F93DB"
      text-color="#FFFFFF"
      active-text-color="#3F93DB"
    >
      <sidebar-item v-for="route in menuArr" :key="route.path" :item="route" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'menuArr',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: relative;
  .logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    line-height: 64px;
    text-align: center;
    background-color: rgba(63,147,219,1);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      font-size:16px;
      font-weight:500;
      color:rgba(255,255,255,1);
      padding-left: 14px;
    }
  }
  .sidebar-menu {
    padding-top: 64px;
  }
}
</style>
