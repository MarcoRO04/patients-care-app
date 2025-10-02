<script>

export default{
  name: 'App',
  data(){
    return {
      login: false,
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
    testPromise(){
      let p = new Promise((resolve, reject) => {})
    },
  },
  created () {
    this.emitter.on('login_process',(event)=>this.handleLogin(event.my_login));
  }
}
</script>

<template>
  <!--
  <header>

  </header>-->

  <p>Bun venit! Status login: {{this.login}}</p>
  <button v-show="login">Retete</button>
  <button>Meniu</button>
  <button>Pacienti</button>
  <RouterView />
</template>

<style scoped>
/*
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
/*
@media (max-width: 400px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
