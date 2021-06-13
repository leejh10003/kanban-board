<template>
  <div>
    {{boards}}
  </div>
</template>
<style>

</style>
<script>
import { getToken } from '../vue-apollo'
import gql from 'graphql-tag'
export default {
  async beforeCreate(){
    await getToken();
    if (!this.$store.state.loggedIn){
      this.$router.push('/naverAuth')
    }
  },
  apollo: {
    boards: {
      variables: {
        id: this.$store.state.id
      },
      query: gql`query($id: Int!){
        boards(where: {boards_users: {id: {_eq: $id}}}) {
          id
          name
          progress(where: {user_id: {_eq: $id}}) {
            board_id
            progress
            column {
              name
            }
            finished_num
            column_id
            card_num
          }
        }
      }
      `
    }
  }
}
</script>