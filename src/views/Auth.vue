<template>
  <div>
    Authed
  </div>
</template>
<script>
export default {
  beforeCreate: function(){
    console.log(this.$route.query)
  }
}
</script>