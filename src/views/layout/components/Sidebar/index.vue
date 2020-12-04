<template>
  <div>
    <div class="logo">
      <img width="31" height="31" src="@/assets/images/logo-nav.png" alt="">
      <span class="text">教学管理平台</span>
    </div>
    <el-scrollbar class="sidebar-container" wrap-class="scrollbar-wrapper">
      <el-menu
          class="sidebar-menu"
          ref="menu"
          :show-timeout="200"
          :default-active="$route.path"
          mode="vertical"
          router
          background-color="#fff"
          text-color="#666666"
          active-text-color="#3F93DB"
          :default-openeds="openeds"
      >
        <sidebar-item v-for="route in menuArr" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
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
  watch: {
    menuArr: {
      handler(val) {
        // setTimeout(() => {
        //   this.$refs.menu.open(0)
        // }, 300)
        this.openeds = val ? val.map(e => {
          return e.menuUrl
        }) : []
      },
      immediate: true
    }
  },
  data() {
    return {
      openeds: []
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 210px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background-color: rgba(63,147,219,1);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -5px 4px 8px 0 rgba(0,11,30,0.12);
  .text {
    font-size:16px;
    font-weight:500;
    color:rgba(255,255,255,1);
    padding-left: 14px;
  }
}
.sidebar-container {
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0,11,30,0.08);
  .sidebar-menu {
    /*padding-top: 64px;*/
  }
}
</style>
