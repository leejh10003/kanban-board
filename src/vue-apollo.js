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
    console.log('getToken')
    const currentToken = localStorage.getItem('token')
    if (!currentToken || Date(jwtDecode(currentToken)) < Date.new()){
      const { data: { token } } = await axios.post('https://trello.jeontuk-11.link/refresh')
      localStorage.setItem('token', token)
      return token
    } else {
      return currentToken
    }
  } catch(e) {
    localStorage.removeItem('token')
    store.commit('logout')
    router.push('/naverAuth')
    throw e
  }
}

const authLink = setContext(async(_, { headers }) => {
  try {
    const applyToken = await getToken()
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${applyToken}`
      }
    }
  } catch (e) {
    localStorage.removeItem('token')
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
