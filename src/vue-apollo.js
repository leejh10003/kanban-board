import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { store } from './vuex-config'
import { setContext } from '@apollo/link-context'
import router from './router'
Vue.use(VueApollo)

export const getToken = async function(){
  try{
    const currentToken = localStorage.getItem('token')
    var applyToken
    if (!currentToken || Date(jwtDecode(currentToken)) < Date.now()){
      const result = await axios.post('https://trello.jeontuk-11.link/refresh')
      applyToken = result.data.token
    } else {
      applyToken = currentToken
    }
    if (!store.state.loggedIn){
      store.commit('login', jwtDecode(applyToken))
    }
    return applyToken
  } catch(e) {
    localStorage.removeItem('token')
    store.commit('logout')
    router.push('/naverAuth')
    console.log('push route success', e)
    throw e
  }
}

const authLink = setContext(async(_, { headers }) => {
  const applyToken = await getToken()
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${applyToken}`
    }
  }
})

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_HTTP || 'https://trello.jeontuk-11.link/console/v1/graphql',
});

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS || 'wss://trello.jeontuk-11.link/console/v1/graphql',
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      const applyToken = await getToken()
      return {
        headers: {
          Authorization: `Bearer ${applyToken}`
        }
      }
    }
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
);

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
