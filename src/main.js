import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/theme/index.css'
// 通过在线链接引入css
// import './assets/font/iconfont.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as globalMethods from './utils/globalMethods'
import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

import '@/styles/index.scss' // global css

import EasyCallPlugin from '@/plugins/EasyCallPlugin';
Vue.use(EasyCallPlugin);

import StuCard from '@/components/StuCard'

Vue.component('StuCard', StuCard)

import selectMixin from '@/views/mixins/select.js'
Vue.mixin(selectMixin)

/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
// import '../mock' // simulation data

for (const key of Object.keys(globalMethods)) {
  Vue.prototype[`$_${key}`] = globalMethods[key]
}

// 修改全局配置
console.log(ElementUI)
ElementUI.Dialog.props.appendToBody.default = true;
ElementUI.Drawer.props.appendToBody.default = true;
Vue.use(ElementUI)
Vue.directive('has', {
  // inserted: function(el, binding) {
    // return void '不做按钮权限'
    // if (!permissionJudge(binding.value)) {
    //   el.parentNode.removeChild(el);
    // }
    // function permissionJudge(value) {
    //   // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
    //   console.log(store.getters.userOrganId)
    //   debugger
      // const list = JSON.parse(localStorage.getItem('menuList'))
      // for (const item of list) {
      //   if (item.apiUrl === value) {
      //     return true;
      //   }
      // }
      // return false;
    // }
  // }
})
Vue.directive('all', {
  inserted: function(el, binding) {
    if (!permissionJudge()) {
      el.parentNode.removeChild(el);
    }
    function permissionJudge(value) {
      return (store.getters.userOrganId + '') === '1'
    }
  }
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
