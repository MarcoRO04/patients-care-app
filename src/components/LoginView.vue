<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'LoginView',
  components: { RouterLink },
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      userList: [],
      input_ok: false,
    }
  },

  mounted() {
    let users = JSON.parse(localStorage.getItem('users'))
    this.userList = this.userList === null ? [] : JSON.parse(localStorage.getItem('users'))
    console.log(users)
    console.log(this.userList)
  },
  methods: {
    validate() {
      let regex = /^[a-zA-Z0-9]{5,19}$/
      if (regex.test(this.user.username) === false || !this.user.username || !this.user.password) {
        this.input_ok = false
        document.getElementById('username').style.borderColor = 'red'
        console.log('Please make sure you respect the format. Do not let any field empty!')
      } else {
        this.input_ok = true
        document.getElementById('username').style.borderColor = 'green'
        console.log('Correct format!')
      }
    },
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
        console.log('Login successful')
      }
    },
  },
}
</script>

<template>
  <div>
    <label for="username">Username: </label><br />
    <input
      type="text"
      id="username"
      v-model="user.username"
      @change="validate"
      maxlength="19"
      required
    /><br />

    <label for="pass">Parola: </label><br />
    <input type="password" id="pass" v-model="user.password" maxlength="19" required /><br />

    <input type="checkbox" id="remember_me" :disabled="!input_ok" />
    <label for="remember_me">Ține-mă minte!</label><br />

    <button @click="login" :disabled="!input_ok">Login</button><br />
    <RouterLink to="/recover_password">Ai uitat parola?</RouterLink>
  </div>
</template>

<style scoped></style>
