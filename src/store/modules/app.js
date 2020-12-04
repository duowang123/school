import Cookies from 'js-cookie'
import { getOrgan, getOrganChild, getTeacherOrgans, getSchoolOrgans, getYearAndSemester, getSysDictList } from '@/api/organ'

const app = {
  state: {
    sidebar: {
      opened: true,
      // opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    yearAndSemester: [], // 学年、学期联动数据
    schoolYearOptions: [], // 学年数据
    device: 'desktop',
    organList: [], // 机构列表：总院、教学点、学校
    schoolList: [], // 所有的学校和教学点
    teacherList: [], // 教学点列表
    schoolOrgansList: [], // 学校列表
    identificationList: []
  },
  mutations: {
    // 获取学年和学期数据
    GET_YEAR_AND_SEMESTER: (state, data) => {
      data.schoolYears = data.schoolYears.map(e => {
        return { babel: e, value: e }
      })
      state.schoolYearOptions = data.schoolYears
      state.yearAndSemester = data
    },
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
    },
    SET_SCHOOL_LIST: (state, schoolList) => {
      sessionStorage.setItem('schoolList', JSON.stringify(schoolList))
      state.schoolList = schoolList
    },
    SET_TEACHER_LIST: (state, teacherList) => {
      sessionStorage.setItem('teacherList', JSON.stringify(teacherList))
      state.teacherList = teacherList
    },
    SET_SCHOOL_ORANGS: (state, schoolOrgansList) => {
      sessionStorage.setItem('schoolOrgansList', JSON.stringify(schoolOrgansList))
      state.schoolOrgansList = schoolOrgansList
    },
    SET_IDENTIFICATION_LIST: (state, identificationList) => {
      sessionStorage.setItem('identificationList', JSON.stringify(identificationList))
      state.identificationList = identificationList
    },

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
    },
    updateSchoolList({ commit }) {
      return new Promise(resolve => {
        getOrganChild({ name: '' }).then(res => {
          const list = res.data.list || []
          commit('SET_SCHOOL_LIST', list)
          resolve(resolve)
        })
      })
    },
    updateTeacherList({ commit }) {
      return new Promise(resolve => {
        getTeacherOrgans({}).then(res => {
          const list = res.data.list || []
          commit('SET_TEACHER_LIST', list)
          resolve(resolve)
        })
      })
    },
    updategetSchoolOrgansList({ commit }) {
      return new Promise(resolve => {
        getSchoolOrgans({}).then(res => {
          const list = res.data.list || []
          commit('SET_SCHOOL_ORANGS', list)
          resolve(resolve)
        })
      })
    },
    getYearAndSemester({ commit }) {
      return new Promise(resolve => {
        getYearAndSemester().then(res => {
          const list = res.data || []
          commit('GET_YEAR_AND_SEMESTER', list)
          resolve(list)
        })
      })
    },
    updateIdentificationList({ commit }) {
      return new Promise(resolve => {
        getSysDictList({ code: '0050' }).then(res => {
          const list = res.data || []
          commit('SET_IDENTIFICATION_LIST', list)
          resolve(list)
        })
      })
    }
  }
}

export default app
