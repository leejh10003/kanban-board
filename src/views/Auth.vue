<template>
  <div>
    
  </div>
</template>
<script>
import axios from 'axios' //eslint-disable-line no-unused-vars
import jwtDecode from "jwt-decode";
export default {
  mounted: async function(){
    const { code, state } = this.$route.query //eslint-disable-line no-unused-vars
    const loading = this.$vs.loading({
      type: 'corners',
      color: '#2BD400',
      scale: 4,
      text: '로그인 중...'
    })
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const { data: { newUser, token } } = await axios.post('https://trello.jeontuk-11.link/login/naver', {//eslint-disable-line no-unused-vars
        code, state
      })
      const authResult = jwtDecode(token)
      console.log(authResult)
    } catch (e){
      console.error(e)
      loading.close()
      this.$router.push('/naverAuth')
    }
  }
}
</script>