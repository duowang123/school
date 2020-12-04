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
      activeName: '',
      activeSys: ''
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
    this.activeName = this.menu.activeSys
    setTimeout(() => {
      this.initMenu()
    })
  },
  methods: {
    ...mapMutations(['set_system_menu', 'set_active_system']),
    handleClick({ name, init = false }, event) {
      const menu = this.menu.sys[name]
      this.set_system_menu(menu)
      this.set_active_system(this.activeName)
      if (!init) {
        const firstChildMenuUrl = this.$_getValue(menu, '0.children.0.menuUrl', '')
        this.$nextTick(() => {
          firstChildMenuUrl && this.$router.replace(firstChildMenuUrl)
        })
      }
    },
    // 根据当前路径初始化菜单
    initMenu() {
      const curPath = this.$route.path
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

      const name = this.activeName || this.sys[0].label
      // console.log(this.$_getValue(this.menu, `sys.${name}.0.children.0.menuUrl`, 'dashboard'))
      // if (false) {
      //   this.$router.replace({ path: this.$_getValue(this.menu, `sys.${name}.0.children.0.menuUrl`, 'dashboard')})
      // }
      this.handleClick({ name, init: true })
    }
  }
}
</script>

<style scoped lang="scss">
.sys-tabBars {
  display: inline-block;
  margin: 0 0 0 24px;
  border-bottom: 2px solid #fff;
  /deep/ .el-tabs__item {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #fff;
    &.is-active {
      color: #fff;
    }
  }
  /deep/ .el-tabs__nav-wrap::after  {
    display: none;
  }
}
</style>
