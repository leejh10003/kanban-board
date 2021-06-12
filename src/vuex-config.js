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
      const { name, thumbnail, email } = user
      console.log(user, name, thumbnail, email)
      state.loggedIn = true
      state.user.thumbnail = thumbnail
      state.user.name = name
      state.user.email = email
      console.log(state.user)
    },
    logout (state){
      state.loggedIn = false
      state.user.thumbnail = null,
      state.user.name = null
    }
  }
})