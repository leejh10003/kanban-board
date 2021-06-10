<template>
  <div v-if="$apollo.queries.boards.loading">
    테스트
  </div>
  <div v-else>
    <board-card
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
  data: function(){
    return {}
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
      }`
    }
  }
}
</script>
<style>

</style>