import mockMenuData from '@/router/menu.json5'
import * as api from '@/api/commonality'
import _ from 'lodash'
import store from "../index";

function flattenMenu(menu, parents = []) {
  if (Array.isArray(menu)) {
    return menu.map(v => flattenMenu(v, [...parents]))
  } else if (menu && (menu.menuType < 3)) {
    return menu.children ?
      [{ ...menu, parents }].concat(flattenMenu(menu.children, [...parents, menu]))
      :
      [{ ...menu, parents }]
  }
}

const menu = {
  state: {
    init: false,
    menuArr: [],
    menuSet: {},
    sys: [],
    activeSys: '机构'
  },
  mutations: {
    set_system_menu: (state, menu) => {
      state.init = true
      state.menuArr = menu
      state.menuSet = _.keyBy(_.flattenDeep(flattenMenu(menu)).filter(e => e), 'menuUrl')
    },
    set_system: (state, sys) => {
      state.sys = sys
    },
    set_active_system: (state, sysName) => {
      state.activeSys = sysName
    }
  },
  actions: {
    setMenu({ commit }, store) {
      return new Promise(resolve => {
        api.menuListSelect({ roleId: '1' }).then(response => {
          // 调用递归方法获得按钮数据
          // localStorage.setItem('menuList', JSON.stringify({}));
          // localStorage.setItem('menuList', JSON.stringify(response.data).sysMenu[0].children);
        })
        // 保存菜单按钮权限数据至vuex中
        api.menuUserList({}).then(res => {
          if (res.data.sysMenu !== []) {
            // TODO 后续续修改为从服务器获取，并且做数据处理
            const { activeSys, sys } = formatMenu(res.data.sysMenu)
            commit('set_system_menu', sys[activeSys])
            commit('set_system', sys)
            commit('set_active_system', activeSys)
          } else {
            // 如果没有权限默认初始化首页权限页路由
            commit('set_system_menu', mockMenuData)
          }
          resolve()
        }).catch(() => {
          // 如果没有权限默认初始化首页权限页路由
          commit('set_system_menu', mockMenuData)
        })
      })
    }
  }
}

export default menu

function formatMenu(data) {
  const activeSys = '机构'
  const sys = {}
  data.forEach(e => {
    e.children && (sys[e.menuName] = e.children)
  })
  return {
    activeSys,
    sys
  }
}
