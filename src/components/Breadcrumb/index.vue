<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.menuName" :key="item.menuUrl">
        <span v-if="item.redirect === false || index === levelList.length-1" class="no-redirect">{{ item.title || item.menuName }}</span>
        <span v-else class="header"> {{ item.title || item.menuName }}</span>
<!--        <router-link v-else :to="resolvePath(item)">{{ item.title || item.menuName }}</router-link>-->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
// import pathToRegexp from 'path-to-regexp'
import { validateURL } from '@/utils/validate'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  mounted() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const { path, query } = this.$route
      const menuSet = this.$store.getters.menu.menuSet
      if (path !== '/iframe') {
        this.levelList = menuSet[path] ? menuSet[path].parents.concat([menuSet[path]]) : []
      } else {
        const { source } = query
        this.levelList = menuSet[source].parents.concat([menuSet[source]])
      }
    },
    resolvePath(route) {
      if (this.isExternalLink(route.menuUrl)) {
        if (route.external === true) {
          return route.menuUrl
        }
        return `/iframe?source=${encodeURIComponent(route.menuUrl)}`
      }
      return location.hash
      // return route.menuUrl
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 16px;
    height: 46px;
    /*line-height: 46px;*/
    margin-left: 24px;
    padding-top: 16px;
    width: 100%;
    background-color: #f3f5f7;
    color: #999999;
    z-index: 99;
    margin-top: 10px;
    .el-breadcrumb__separator {
      color: #000000;
    }
    .header {
      color: #212121;
      font-weight: 700;
    }
    .no-redirect {
      color: #333333;
      cursor: text;
    }
  }
</style>
