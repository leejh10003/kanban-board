import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    thumbnail: null,
    name: null,
    email: null,
  },
  mutations: {
    login (state, user) {
      console.log(user)
      state.loggedIn = true
      state.email = user.email
      state.name = user.name
      state.thumbnail = user.thumbnail
      console.log(state)
    },
    logout (state){
      state.loggedIn = false
      state.user.thumbnail = null,
      state.user.name = null
    }
  }
})