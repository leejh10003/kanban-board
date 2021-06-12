import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuesax from 'vuesax'
//import { createProvider } from './vue-apollo'
import { apolloProvider } from './vue-apollo'
import { store } from './vuex-config'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false
import 'vuesax/dist/vuesax.css' //Vuesax styles
  Vue.use(Vuesax, {
    // options here
  })
  Vue.use(VueMaterial)
new Vue({
  router,
  store,
  apolloProvider,
  //apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
