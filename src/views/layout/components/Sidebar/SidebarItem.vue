<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="isNotChildren(item)">
      <app-link :to="resolvePath(item)">
        <el-menu-item
          :index="resolvePath(item)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            :icon="item.menuIcon"
            :title="item.menuName"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item)">
      <template slot="title">
        <item
            :icon="item.menuIcon"
            :title="item.menuName"
        />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden && (child.menuType < 3)">
        <sidebar-item
          v-if="child.children && child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.menuUrl"
          :base-path="resolvePath(child)"
          class="nest-menu"/>
        <app-link v-else :to="resolvePath(child)" :key="child.menuName">
          <el-menu-item :index="resolvePath(child)">
            <item
              :icon="child.menuIcon"
              :title="child.menuName"
            />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import { validateURL } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    isNotChildren(item) {
      const { children = [] } = item
      return children.filter(item => {
        if (item.hidden || item.menuType > 2) {
          return false
        } else {
          return true
        }
      }).length === 0
    },
    resolvePath(route) {
      if (this.isExternalLink(route.menuUrl)) {
        if (route.external === true) {
          return route.menuUrl
        }
        return `/iframe?source=${encodeURIComponent(route.menuUrl)}`
      }
      return route.menuUrl
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    }
  }
}
</script>
