<template>
  <card
    @click="toBoard(board.id)"
    >
      <template #title>
        <h3 v-if="!titleEditing" @click.stop="titleEdit" class="board-title">{{board.name}}</h3>
        <input @keyup.enter="submit" v-else v-model="board.name" @click.stop="titleEdit" class="board-title-edit" placeholder="제목..."/>
      </template>
      <template #tailing>
        <div class="tailing-users">
          <div
            class="user-entities"
            v-for="(entity, index) in mapUsers(board.boards_users, board.boards_users_aggregate.aggregate.count)"
            :key="`${board.id}-${entity.id}`">
              <div class="user-entity" v-if="entity.type === 'thumbnail'" :src="entity.value" :style="{zIndex: index, backgroundImage: `url(${entity.value})`, backgroundSize: 'cover'}"/>
              <div class="user-entity user-text" v-else-if="entity.type === 'name'" >{{entity.id}}</div>
              <div class="user-entity user-left" v-else>{{entity.value}}</div>
          </div>
        </div>
      </template>
    </card>
</template>
<script>
import gql from 'graphql-tag'
import card from './Card.vue'
export default {
  data(){
    return {
      titleEditing: false,
    }
  },
  components: {
    card
  },
  methods: {
    async submit(){
      this.titleEditing = false
      this.$apollo.mutate({
        variables: {
          name: this.board.name,
          id: this.board.id
        },
        mutation: gql`mutation($name: String!, $id: Int!){
          update_boards_by_pk(pk_columns: {id: $id}, _set: {name: $name}){
            id
          }
        }`
      })
    },
    titleEdit(){
      this.titleEditing = true
    },
    toBoard: function(id){
      this.$router.push(`/board/${id}`)
    },
    mapUsers: function (users, count){
      const entities = users.map((user) => {
        if(user.thumbnail){
          return {
            type: 'thumbnail',
            value: user.thumbnail,
            id: user.id
          }
        } else {
          return {
            type: 'name',
            value: user?.name?.charAt(0),
            id: user.id
          }
        }
      })
      if (count > 5){
        entities.concat({
          type: 'count',
          value: `+${count - 5}`,
          id: 'board'
        })
      }
      return entities
    }
  },
  props: {
    board: Object
  }
}
</script>
<style scoped>
.board-title-edit{
  border: 0px solid transparent;
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  width: 100%;
}
.board-title{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid transparent;
}
.board-title:hover{
  border: 1px solid black;
}
.user-entities{
  display: inline-block;
  margin-left: -10px;
}
.user-text{
  text-align: center;
  vertical-align: middle;
  line-height: 30px;
  background-color: #2DB400;
  color: white;
  font-weight: 800;
  border: solid;
}
.user-left{
  text-align: center;
  vertical-align: middle;
  line-height: 30px;
  background-color: white;
  color: black;
  font-weight: 800;
  border: solid;
}
.user-entity{
  height: 30px;
  width: 30px;
  border-radius: 15px;
  border: solid #e7e7e7 1px;
}
.tailing-users{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px;
}
</style>