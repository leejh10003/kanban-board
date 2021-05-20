<template>
  <div>
    <h2>로그인 유저 정보</h2>
    <div v-if="me">
      <div>{{ me.id }}</div>
      <div>{{ me.username }}</div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      me: null
    }
  },
  apollo: {
    me: gql`query {
      me {
        id
        username
      }
    }
    `
  }
}
</script>