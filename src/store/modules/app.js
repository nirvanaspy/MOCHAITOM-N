import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'en',
    projectNum: Cookies.get('projectNum'),
    projectExist: Cookies.get('projectExist')
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_PROJECTNUM: (state, projectNum) => {
      state.projectNum = projectNum
      Cookies.set('projectNum', projectNum)
    },
    SET_PROJECTEXIST: (state, projectExist) => {
      state.projectExist = projectExist
      Cookies.set('projectExist', projectExist)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setProjectNum: ({ commit }, projectNum) => {
      commit('SET_PROJECTNUM', projectNum)
    },
    setProjectExist: ({ commit }, projectExist) => {
      commit('SET_PROJECTEXIST', projectExist)
    }
  }
}

export default app
