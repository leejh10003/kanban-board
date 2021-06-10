<template>
  <div>
    Authed
  </div>
</template>
<script>
import axios from 'axios'
export default {
  beforeCreate: async function() {
    const { code, state } = this.$route.query
    const { data: { token } } = await axios.post('https://trello.jeontuk-11.link/login/naver', {
      code,
      state,
      redirectURI: 'https://trello.jeontuk-11.link/#/auth'
    })
    localStorage.setItem('token', token)
  }
}
</script>