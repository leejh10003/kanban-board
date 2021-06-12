<template>
  <div v-if="$apollo.queries.boards.loading">
  </div>
  <div v-else>
    <vs-dialog v-model="addNewCard">
      <template #header>
        <h3 class="not-margin">
          카드 새로 생성
        </h3>
      </template>
      <div class="con-form">
        <h4 style="text-align: left;">새 보드 제목</h4>
        <vs-input v-model="newBoardTitle" placeholder="새 보드 제목"/>
        <div style="display: flex; align-items: center;"><h4 style="text-align: left;">관리자</h4> 
          <vs-tooltip>
            {{`${$store} ${$store.state.name} ${$store.state.email}`}}
            <md-icon style="margin: 0px; margin-left: 8px;">help_outline</md-icon>
            <template #tooltip>
              해당 보드에 관한 모든 권한을 갖습니다. 보드를 생성하신 사용자님은 기본적으로 관리자입니다.
            </template>
          </vs-tooltip></div>
        <div style="display: flex; align-items: center;"><h4 style="text-align: left;">참여자</h4> 
          <vs-tooltip>
            <md-icon style="margin: 0px; margin-left: 8px;">help_outline</md-icon>
            <template #tooltip>
              해당 보드에 관한 일부 권한을 갖습니다. 보드 삭제, 칼럼 이름 변경 등이 제한됩니다.
            </template>
          </vs-tooltip></div>
      </div>

      <!--

      <template #footer>
        <div class="footer-dialog">
          <vs-button block>
            Sign In
          </vs-button>

          <div class="new">
            New Here? <a href="#">Create New Account</a>
          </div>
        </div>
      </template>-->
    </vs-dialog>
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
    <md-button class="md-fab" id="create-board" @click="addNewCard = true">
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
.not-margin{
  margin: 0px;
  padding: 10px;
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
    console.log(this.$store)
  },
  data: function(){
    return {
      loading: null,
      addNewCard: false,
      newBoardTitle: '',
      admins: [],
      participants: [],
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