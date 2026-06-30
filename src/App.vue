<!--This is view file that acts as a main.

-->

<script>

export default {
  name: 'App',
  components: {},
  created() {
    this.emitter.on('login_process', (event) => this.handleLogin(event.my_login))
  },
  mounted() {
    localStorage.setItem('users', JSON.stringify([{"username":"marco","password":"2911"},{"username":"daniel","password":"6666"},{"username":"alina","password":"1234"}]));
    // this.getRecipesListFromBE();
  },

  data() {
    return {
      login: false,
      // recipes_list:[],
    }
  },
  methods: {
    /*when App.vue receives the "OK" from LoginView.vue, it pushed the /recipes path (RecipesView.vue)
    and sets a token variable in the local storage. This token is used to tell if the user is logged in or not.
    If the user is not logged, and so the token doesn't exist, then the ErrorView will be pushed.
    (go to index.js file to see the protection mechanism against unauthorized users)
    * */
    handleLogin(login_status) {
      this.login = login_status
      if (this.login === true) {
        localStorage.setItem('context', '123')
        this.$router.push('/recipes')
      } else {
        localStorage.removeItem('context')
        this.$router.push('/')
      }
    },
  },
}
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
