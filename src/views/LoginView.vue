<script>
// import { RouterLink } from 'vue-router'

export default {
  name: 'LoginView',
  // components: { RouterLink },
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      userList: [],
      input_ok: false,
      my_login: false,
    }
  },
  mounted() {
    let users = JSON.parse(localStorage.getItem('users'))
    this.userList = (this.userList === null) ? [] : users
  },
  computed: {
    computeInputOk(){
      return (this.user.username.length !== 0 && this.user.password.length !== 0)
    },
  },
  methods: {
    login() {
      let found = false
      for (let x = 0; x < this.userList.length; x++) {
        if (
          this.userList[x].username === this.user.username &&
          this.userList[x].password === this.user.password
        ) {
          found = true
          break
        }
      }
      if (found === false) {
        console.log('Wrong username or password')
      } else {
        this.emitter.emit("login_process",{my_login : true}) //my_login:true
        console.log('Login successful')
        this.goToRecipesView()
      }
    },
    goToRecipesView(){
      this.$router.push(`/recipes`)
    },
  },
}
</script>

<template>
  <div class="login-form">
    <div class="login-header">
      <h2 style="color: white; font-weight: bold">Login</h2>
    </div>
    <div style="padding: 10px 10px 10px 20px">
      <label for="username">Username: </label><br />
      <input type="text" id="username" v-model="user.username" required /><br />

      <label for="pass">Parola: </label><br />
      <input type="password" id="pass" v-model="user.password" required /><br />
<!--      <RouterLink to="/recover_password">Ai uitat parola?</RouterLink>-->
      <br /><br />
<!--      <button class="cancel-button" @click="goToRecipesView">Anulare</button>-->
      <button @click="login" :disabled="!computeInputOk">Login</button><br />
    </div>
  </div>
</template>

<style scoped>
.login-form {
  height: 400px;
  width: 600px;
  border: 2px solid #ccc;
  margin: 100px auto;
}

.login-header {
  background-color: #cf2e2e;
  color: white;
  font-weight: bold;
  padding: 5px 10px 5px 20px;
}

input {
  background: white;
  width: 60%;
  font-size: 14px;
  padding: 12px 20px 12px 10px;
  border: 1px solid #ddd;
  margin-bottom: 18px;
  border-radius: 10px;
  margin-right: 15px;
}

button {
  width: 90px;
  height: 33px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: #cf2e2e;
  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 5px;
}

.cancel-button {
  margin-right: 16px;
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
}

.save-button {
  margin-right: 16px;
  border: none;
}
</style>
