<template>
  <div v-if="$apollo.queries.boards.loading">
  </div>
  <div v-else>
    <vs-navbar color="#7d33ff" text-white square center-collapsed v-model="active">
        <template #left>
          <img src="/logos/logo-vuesax-logotipo-vuesax-png-4.png" alt="">
        </template>
        <vs-navbar-item :active="active == 'guide'" id="guide">
          Guide
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'docs'" id="docs">
          Documents
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'components'" id="components">
          Components
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'license'" id="license">
          license
        </vs-navbar-item>
        <template #right>
          <vs-button color="#fff" flat >Login</vs-button>
          <vs-button color="#fff" border >Get Started</vs-button>
        </template>
      </vs-navbar>
    <board-card
      :style="{maxHeight: '125px'}"
      v-for="board in boards"
      :key="board.id"
      :board="board"
    />
  </div>
</template>
<script>
import gql from 'graphql-tag'
import BoardCard from '../components/BoardCard.vue'
export default {
  components: {
    'board-card': BoardCard
  },
  mounted(){
    this.loading = this.$vs.loading({
      type: 'corners',
      color: '#2BD400',
      scale: 4,
      text: '로딩 중...'
    })
  },
  data: function(){
    return {
      active: 'guide',
      loading: null
    }
  },
  apollo: {
    boards: {
      query: gql`query {
        boards{
          boards_users(order_by: [{kind: asc}, {id: desc}], limit: 5){
            thumbnail
            name
            id
          }
          boards_users_aggregate{
            aggregate{
              count
            }
          }
          name
          id
        }
      }`,
      update: function (data){
        if (this.loading){
          this.loading.close()
        }
        return data.boards
      }
    }
  }
}
</script>
<style>

</style>