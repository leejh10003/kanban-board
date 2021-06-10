import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    user: {
      thumbnail: null,
      name: null
    }
  },
  mutations: {
    login (state, user) {
      const { name, thumbnail } = user
      state.loggedIn = true
      state.user.thumbnail = thumbnail
      state.user.name = name
    },
    logout (state){
      state.loggedIn = false
      state.user.thumbnail = null,
      state.user.name = null
    }
  }
})