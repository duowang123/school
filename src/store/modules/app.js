import Cookies from 'js-cookie'
import { getOrgan } from '@/api/organ'

const app = {
  state: {
    sidebar: {
      opened: true,
      // opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    organList: sessionStorage.getItem('organList') ? JSON.parse(sessionStorage.getItem('organList')) : []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      // state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      // state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_ORGAN_LIST: (state, organList) => {
      sessionStorage.setItem('organList', JSON.stringify(organList))
      state.organList = organList
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    updateOrganList({ commit }) {
      return new Promise(resolve => {
        getOrgan({ name: '' }).then(res => {
          const organList = res.data.list.map(e => {
            return Object.assign({}, e, {
              label: e.name,
              value: e.id
            })
          })
          commit('SET_ORGAN_LIST', organList)
          resolve(resolve)
        })
      })
    }
  }
}

export default app
