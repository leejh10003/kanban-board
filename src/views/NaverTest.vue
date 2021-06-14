<template>
  <div id="screen">
    
    <div class = "wrap1">
      
      <div id="logo-part">
        <img src="../assets/kanban2.png" id="logo-photo"/>
        <p>간반보드</p>
      </div>
      <div id="login-card">
        <!-- <h1 id="login-title">Sign in</h1> -->
        <img src="../assets/loginbutton.png" id="login-button" v-on:click="naverlogin()"/>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from '../vue-apollo'
export default {
  async beforeCreate(){
    await getToken();
    if (this.$store.state.loggedIn){
      this.$router.push('/boards')
    }
  },
  methods:{             
    naverlogin(){
      var url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=2vi6TcRBTGxoSlFsO_v1&redirect_uri=https%3A%2F%2Ftrello.jeontuk-11.link%2F%23%2Fauth&state=1234';
      window.location.replace(url);
    }
  }
}
</script>
<style>
#screen{
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-image: url('../assets/kan_back.jpg');
  /* background-image: url('../assets/stock_vid.mp4'); */
  
}
#login-card{
    /* box-shadow: 0px 5px 20px 0px rgb(0 0 0 / 5%); */
    /* border-radius: 20px; */
    width: 300px;
    position: absolute;
    height: 200px;
    margin-left: calc(50vw - 150px);
    margin-top: calc(50vh - 230px);
    /* background-color: white; */
}
#login-button{
  height: 48px;
  cursor: pointer;
}
#login-title{
  color: rgba(44, 62, 80, 1);
}

#logo-part{
  margin : auto 0px;
  margin-top: calc(50vh - 280px);
  height: 0px;
  /* margin-top: calc(50vh - 380px); */
}

#logo-part > p{
  margin-top: 18px;
  font-size : xx-large;
  font-weight: bold;
  color: #626262;
}

#logo-photo{
  object-fit:cover;
  height: 180px;
}

.wrap1{
  
}

</style>