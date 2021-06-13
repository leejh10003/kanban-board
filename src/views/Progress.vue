<template>
  <div>
    {{boards_progress}}
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
    boards_progress: {
      variables(){
        return {
          id: this.$store.state.id
        }
      },
      query: gql`query ($id: Int!) {
        boards_progress(where: {user_id: {_eq: $id}}) {
          progress
          finished_num
          card_num
          board{
            name
            id
          }
        }
      }`
    }
  }
}
</script>