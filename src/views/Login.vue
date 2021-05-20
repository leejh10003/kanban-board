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
import { onLogin } from '../vue-apollo.js'
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$apollo.mutate({
        //여기다가 쿼리만 입력하면 될 것 같은데ㅜㅜ
        mutation: gql`mutation 
        }`,
        variables: {
          data: {
            username: this.username,
            password: this.password
          }
        }
      }).then((data) => {
        //로그인을 성공한다면 -> Secure Page로
        console.log(data)
        onLogin(this.$apollo.provider.defaultClient, data.data.login.access_token)
        this.$router.push('/Secure')
      }).catch((error) => {
        // 실패한다면 그냥 이 페이지에 게속 있기
        console.error(error)
      })
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