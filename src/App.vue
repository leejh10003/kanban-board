<template>
  <div id="app">
    <vs-navbar v-if="barVisible" :fixed="true" style="position: relative;" color="#7d33ff" text-white square center-collapsed v-model="active">
      <template #left>
        <img src="/logos/logo-vuesax-logotipo-vuesax-png-4.png" alt="">
      </template>
      <vs-navbar-item v-if="entityVisible" to="/boards" :active="selected === '/boards'" id="boards">
        보드들
      </vs-navbar-item>
      <vs-navbar-item v-if="entityVisible" to="/progress" :active="selected === '/progress'" id="progress">
        진척도
      </vs-navbar-item>
      <template #right>
        <vs-button @click="toBoards" v-if="selected === '/board'" color="#fff" flat >보드들</vs-button>
        <vs-button @click="logout" color="#fff" border >로그아웃</vs-button>
      </template>
    </vs-navbar>
    <router-view style="padding-top: 44px"/>
  </div>
</template>
<script>
import { logout } from './vue-apollo'
export default {
  watch: {
    $route(to){
      if (['/boards', '/progress'].includes( to?.path)){
        this.barVisible = true
        this.entityVisible = true
        this.selected = to?.path
      } else if (to?.path?.startsWith('/board/')){
        this.barVisible = true
        this.entityVisible = false
        this.selected = '/board'
      } else {
        this.barVisible = false
        this.entityVisible = false
      }
      return this.$route
    }
  },
  created(){
    const to = this.$router.currentRoute
    if (['/boards', '/progress'].includes( to?.path)){
        this.barVisible = true
        this.entityVisible = true
        this.selected = to?.path
      } else if (to?.path?.startsWith('/board/')){
        this.barVisible = true
        this.entityVisible = false
      } else {
        this.barVisible = false
        this.entityVisible = false
      }
      return this.$route
  },
  methods: {
    logout,
    toBoards(){
      this.$router.push('/boards')
    }
  },
  data(){
    return {
      active: 'guide',
      barVisible: true,
      entityVisible: true,
      selected: '/boards'
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>