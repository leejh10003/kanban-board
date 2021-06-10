<template>
  <div v-if="boards.loading">
  </div>
  <div v-else>
    <card
      v-for="board in boards"
      :key="board.id"
    >
    </card>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import card from '../components/Card.vue'
export default {
  components: {
    card
  },
  data: function(){
    return {}
  },
  apollo: {
    boards: {
      query: gql`query {
        boards{
          boards_users(order_by: [{kind: asc}, {id: desc}]){
            thumbnail
            name
            id
          }
          name
          id
        }
      }`
    }
  }
}
</script>
<style>

</style>