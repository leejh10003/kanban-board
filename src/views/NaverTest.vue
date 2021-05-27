<template>
  <div>
	<a class="button_naver" v-on:click="naverlogin()">
          <h5 style="color:black; margin-top:0px; padding-top:13px;">네이버 아이디로 로그인</h5>
	</a>
</div>
</template>
<script>
export default {
  methods:{             
    naverlogin(){
      var url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=2vi6TcRBTGxoSlFsO_v1&redirect_uri=http://ec2-54-180-17-216.ap-northeast-2.compute.amazonaws.com/#/auth&state=1234';
      window.location.replace(url);
    }
  }
}
</script>