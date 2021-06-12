import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    thumbnail: null,
    name: null,
    email: null,
    id: null,
  },
  mutations: {
    login (state, user) {
      state.loggedIn = true
      state.email = user.email
      state.name = user.name
      state.thumbnail = user.thumbnail
      state.id = parseInt(user["https://hasura.io/jwt/claims"]['x-hasura-user-id'])
    },
    logout (state){
      state.loggedIn = false
      state.user.thumbnail = null,
      state.user.name = null
    }
  }
})