import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    user: {
      thumbnail: null,
      name: null,
      email: null
    }
  },
  mutations: {
    login (state, user) {
      console.log(user)
      state.loggedIn = true
      state.user.email = user.email
      state.user.thumbnail = user.thumbnail
      state.user.name = user.name
      console.log(state.user)
    },
    logout (state){
      state.loggedIn = false
      state.user.thumbnail = null,
      state.user.name = null
    }
  }
})