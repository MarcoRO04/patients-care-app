<script>

export default{
  name: 'App',
  created () {
    this.emitter.on('login_process',(event)=>this.handleLogin(event.my_login));
  },
  mounted(){
    // localStorage.setItem('users', JSON.stringify([{"username":"marco","password":"2911"},{"username":"daniel","password":"6666"},{"username":"alina","password":"1234"}]));
    // this.initializeRecipeListFromBE();
  },

  data(){
    return {
      login: false,
      recipes_list:[],
    }
  },
  methods: {
    handleLogin(login_status) {
      this.login = login_status;
      if (this.login === true) {
        localStorage.setItem('context',"123")
        this.$router.push('/recipes');
      }else{
        localStorage.removeItem('context');
        this.$router.push('/');
      }
    },
    //
    // displayList(){
    //   console.log(this.recipes_list);
    //   this.emitter.emit("list_from_BE",{list: this.recipes_list});
    // },
    //for the moment let's assume that the list exists and it is initialized
    initializeRecipeListFromBE(){
      fetch('http://localhost:3001/recipes',{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

        /*Preflight si apoi raspunsul - e inca in pending*/
      }).then(rsp =>{
        return rsp.json()
      }).then(list => {
        // console.log(list)
        this.recipes_list = list
        this.emitter.emit("list_from_BE",{list: this.recipes_list});
      }).catch(err=>{console.log(err)})
    },
  },
}
</script>

<template>
<!--  <button @click="initializeRecipeListFromBE">Test</button>-->
  <RouterView />
</template>

<style scoped>
</style>
