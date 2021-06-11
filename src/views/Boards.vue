<template>
  <div v-if="$apollo.queries.boards.loading">
  </div>
  <div v-else>
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