<!--
This view was created in case the user forgets his/hers password
NOTE: recipe and prescription terms are used interchangeably-->
<script>
export default {
  name: 'ForgotPasswordView',
  mounted() {
    this.userList = this.userList === null ? [] : JSON.parse(localStorage.getItem('users'))
  },
  data() {
    return {
      recover_pass_user: {
        username: '',
        password: '',
      },
      userList: [],
      found: false,
    }
  },
  methods: {
    recover_password() {
      for (let i = 0; i < this.userList.length; i++) {
        if (this.recover_pass_user.username === this.userList[i].username) {
          this.recover_pass_user.password = this.userList[i].password
          break
        }
      }
      if (this.recover_pass_user.password !== '') {
        console.log('Found user')
        this.found = true
        const paragraphElement = document.createElement('p')
        const node = document.createTextNode('Parola ta este: ' + this.recover_pass_user.password)
        paragraphElement.appendChild(node)
        const divElement = document.getElementById('recovered_password_div')
        divElement.appendChild(paragraphElement)
      } else {
        console.log('No user found')
      }
    },
  },
}
</script>

<template>
  <div>
    <label for="recover_pass_username" style="font-size: 16px"
      >Introduceți mai jos username-ul dvs. : </label
    ><br />
    <input
      type="text"
      id="recover_pass_username"
      v-model="recover_pass_user.username"
      required
    /><br />
    <button @click="recover_password" :disabled="found">Recuperează</button>
  </div>
  <div id="recovered_password_div"></div>
</template>

<style scoped></style>
