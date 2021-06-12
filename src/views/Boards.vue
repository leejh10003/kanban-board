<template>
  <div v-if="$apollo.queries.boards.loading">
  </div>
  <div v-else>
    <vs-row v-for="(row, index) in splitTwo(boards)" :key="`row${index}`" vs-justify="center">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" :lg="row.length === 1 ? 4 : 2" :sm="1" :xs="0">
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" lg="4" sm="5" xs="12" v-for="board in row" :key="`board${board.id}`">
        <board-card
          :board="board"
        />
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" :lg="row.length === 1 ? 4 : 2" :sm="1" :xs="0">
      </vs-col>
    </vs-row>
    <md-button class="md-fab" id="create-board">
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>
<style>
#create-board{
  position: absolute;
  bottom: 30px;
  right: 30px;
}
</style>
<script>
import gql from 'graphql-tag'
import BoardCard from '../components/BoardCard.vue'
/** */
export default {
  methods: {
    splitTwo(list){
      var index = 0;
      var tempArray = [];
      
      for (index = 0; index < list.length; index += 2) {
          var chunk = list.slice(index, index+2);
          // Do something if you want with the group
          tempArray.push(chunk);
      }
      return tempArray;
    }
  },
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