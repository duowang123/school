<template>
  <div class="sys-tabBars">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="s in sys" :key="s.id" class="sys-item" :label="s.label" :name="s.label" />
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SysTabBars',
  data() {
    return {
      activeName: '机构'
    }
  },
  computed: {
    ...mapGetters(['menu']),
    sys() {
      return Object.keys(this.menu.sys).map((e, i) => {
        return { id: i, label: e }
      })
    }
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    ...mapMutations(['set_system_menu', 'set_active_system']),
    handleClick({ name }, event) {
      this.set_system_menu(this.menu.sys[name])
      this.set_active_system(this.activeName)
    },
    // 根据当前路径初始化菜单
    initMenu() {
      const curPath = this.$route.path
      console.log(this.menu.sys)
      for (const sysName in this.menu.sys) {
        const menu = this.menu.sys[sysName]
        menu.forEach(e => {
          if (curPath.search(e.menuUrl) !== -1) {
            this.activeName = sysName
          }
          e.children.forEach(ce => {
            if (curPath.search(ce.menuUrl) !== -1) {
              this.activeName = sysName
            }
          })
        })
      }
      this.handleClick({ name: this.activeName })
      this.set_active_system(this.activeName)
    }
  }
}
</script>

<style scoped lang="scss">
.sys-tabBars {
  display: inline-block;
  margin: 0 0 0 24px;
  /deep/ .el-tabs__item {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #666666;
    &.is-active {
      color: #3F93DB;
    }
  }
  /deep/ .el-tabs__nav-wrap::after  {
    display: none;
  }
}
</style>
