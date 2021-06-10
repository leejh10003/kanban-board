<template>
  <div>
    {{boards}}
  </div>  
</template>
<script>
import gql from 'graphql-tag'
export default {
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