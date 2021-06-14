<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src

import { getToken } from '../vue-apollo'
export default {
  name: 'Home',
  async beforeCreate(){
    await getToken();
    if (this.$store.state.loggedIn){
      this.$router.push('/boards')
    } else {
      this.$router.push('/naverAuth')
    }
  },
}
</script>
