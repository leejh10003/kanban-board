import Vue from 'vue'
import VueApollo from 'vue-apollo'
//import { setContext } from '@apollo/client/link/context'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import axios from 'axios'
import { store } from './vuex-config'
import jwtDecode from 'jwt-decode'
import router from './router'
import { ApolloLink } from '@apollo/client';
import from from 'core-js/features/array/from';
Vue.use(VueApollo)

export const refreshToken = async function(){
  try{
    const result  = await axios.post('https://trello.jeontuk-11.link/refresh')
    localStorage.setItem('token', result.data.token)
    const user = jwtDecode(result.data.token)
    store.commit('login', user)
    return result.data.token
  } catch(e) {
    localStorage.removeItem('token')
    store.commit('logout')
    router.push('/naverAuth')
    throw e
  }
}

const authMiddleware = new ApolloLink(async (operation, forward) => {
  console.log('authlink called')
  const token = localStorage.getItem('token')
  try {
    if (store.state.loggedIn === false){
      store.commit('login', jwtDecode(token))
    }
    var applyToken
    if (!token || new Date((JSON.parse(atob(token.split('.')[1])).exp - 15 * 60 * 1000)) < Date.now()) {
      applyToken = await refreshToken()
    } else {
      console.log(new Date((JSON.parse(atob(token.split('.')[1])).exp - 15 * 60 * 1000)), Date.now())
    }
    operation.setContext({
      headers: {
        Authorization: `Bearer ${applyToken}`
      }
    })
    return forward(operation)
  } catch (e) {
    localStorage.removeItem('token')
    console.error(e)
    router.push('/naverAuth')
  }
})

// Name of the localStorage item'

// Http endpoint

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_HTTP || 'https://trello.jeontuk-11.link/console/v1/graphql',
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS || 'wss://trello.jeontuk-11.link/console/v1/graphql',
  options: {
    reconnect: true,
    lazy: true
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    console.log('link called')
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
);

// Create the apollo client
const apolloClient = new ApolloClient({
  link: from([authMiddleware, link]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})