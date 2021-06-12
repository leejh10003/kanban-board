<template>
  <div v-if="$apollo.queries.boards.loading">
  </div>
  <div v-else>
    <vs-dialog style="z-index: 1000;" v-model="addNewCard">
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
            <md-icon style="margin: 0px; margin-left: 8px;">help_outline</md-icon>
            <template #tooltip>
              해당 보드에 관한 모든 권한을 갖습니다. 보드를 생성하신 사용자님은 기본적으로 관리자입니다.
            </template>
          </vs-tooltip></div>
          <div class="users">
            <vs-tooltip class="user-avatar" >
              <template #tooltip>
                {{currentUser.name}}(기본)
              </template>
              <vs-avatar v-if="currentUser.thumbnail === null">
                <template #text>
                  {{getInitial(currentUser.name)}}
                </template>
              </vs-avatar>
              <vs-avatar v-else>
                <img :src="currentUser.thumbnail" alt=""/>
              </vs-avatar>
            </vs-tooltip>
            <vs-tooltip v-for="user in admins" :key="user.id" class="user-avatar" >
              <template #tooltip>
                {{user.name}}
              </template>
              <vs-avatar v-if="user.thumbnail === null">
                <template #text>
                  {{getInitial(user.name)}}
                </template>
              </vs-avatar>
              <vs-avatar v-else>
                <img :src="user.user" alt=""/>
              </vs-avatar>
            </vs-tooltip>
          </div>
          <el-autocomplete
            class="inline-input"
            v-model="newAdminQuery"
            :fetch-suggestions="querySearch"
            placeholder="새 관리자 이름..."
            @select="handleSelectAdmin"
          />
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
.user-avatar{
  margin: 8px;
}
.users{
  display: flex;
  max-width: 368px;
  flex-wrap: wrap;
}
</style>
<script>
import gql from 'graphql-tag'
import BoardCard from '../components/BoardCard.vue'
/** */
export default {
  computed: {
    currentUser(){
      return this.$store.state
    },
    cssVars() {
      return {
        '--vs-zindex-2': 2000,
      }
    }
  },
  methods: {
    getInitial(name){
      console.log(this.currentUser)
      return name.split(' ').map((part) => part.charAt(0)).slice(0, 2).join()
    },
    handleSelectAdmin(value){
      this.newAdminQuery = ''
      this.admins.push(value)
    },
    async querySearch(queryString, callback){//eslint-disable-line no-unused-vars
      const { data: { user } } = await this.$apollo.query({
        variables: {
          queryString: `%${queryString}%`,
          ids: [].concat(this.participants).concat(this.admins).map((user) => user.id)
        },
        query: gql`query($ids:[Int!]!, $queryString: String!) {
          user(where: {id: {_nin: $ids}, _or: [{name: {_ilike: $queryString}}, {email: {_ilike: $queryString}}]}, limit: 3){
            id
            name
            email
            thumbnail
          }
        }`
      })
      callback(user.map((user) => ({...user, value: `${user.name} (${user.email?? '이메일 없음'})`})))
    },
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
      newAdminQuery: '',
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