<template>
  <!-- Default form register -->
  <form @submit="submit">
    <p class="h4 text-center mb-4">Sign up</p>
    <label for="defaultFormRegisterNameEx" class="grey-text">Your id</label>
    <input type="text" id="defaultFormRegisterNameEx" class="form-control" v-model="username"/>
    <br/>
    <label for="defaultFormRegisterPasswordEx" class="grey-text">Your password</label>
    <input type="password" id="defaultFormRegisterPasswordEx" class="form-control" v-model="password"/>
    <div class="text-center mt-4">
      <button class="btn btn-unique" type="submit" click="register">Register</button>
    </div>
  </form>
  <!-- Default form register -->
</template>

<script>
  import gql from 'graphql-tag';

  const ADD_USER = gql`
    mutation addUser(
        $username: String!
        $password: String!
    ) {
        insert_user(
            objects: [
                {
                username: $username
                password: $password
                }
            ]
        ) 
        {
            returning {
                id
            }
        }
    }`;
  export default {
  apollo: {
    // Simple query that will update the 'hello' vue property
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
      submit(e) {
      e.preventDefault();
      const { username, password } = this.$data;
      this.$apollo.mutate({
        mutation: ADD_USER,
        variables: {
          username,
          password,
        },
      });
    }
  }
}
</script>