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
      query: gql`query{
        boards{
          id
          name
        }
      }`
    }
  }
}
</script>
<style>

</style>