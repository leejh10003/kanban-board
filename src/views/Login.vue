<template>
  <div>
    <form action="" method="POST" @submit.prevent="login">
      <div>
        <input
          type="text"
          v-model="username"
          name="username"
          id="username"
          placeholder="username"
        />
      </div>

      <div>
        <input
          type="password"
          v-model="password"
          name="password"
          id="password"
          placeholder="password"
        />
      </div>

      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const { data: { user : [{id}] } } = await this.$apollo.query({ //eslint-disable-line no-unused-vars
        query: gql`query($username: String!, $password: String!){
          user(where: {_and: [{username: {_eq: $username}}, {password: {_eq: $password}}]}){
            id
          }
        }`,
        variables: {
          username: this.username,
          password: this.password
        }
      })
      this.$router.push('/Secure')
    },
  },
}





</script>

<style scoped>
input {
  padding: 10px 10px;
  font-size: 18px;
  margin-bottom: 9px;
}
button {
  width: 110px;
  padding: 3px;
  background: grey;
  color: white;
  font-size: 16px;
}
</style>