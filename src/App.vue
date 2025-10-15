<script>

export default{
  name: 'App',
  data(){
    return {
      login: false,
    }
  },
  mounted(){
    // localStorage.setItem('users', JSON.stringify([{"username":"marco","password":"2911"},{"username":"daniel","password":"6666"},{"username":"alina","password":"1234"}]));
    // this.isPrime().then(value => {console.log(value); return this.cifraZecilor(value)})
    //               .then(value => {console.log(value);})
    //               .catch(err=>{console.log(err)})
    // this.testAsync()

    // fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error("Could not fetch resource: " + response.statusText);
    //     }
    //     return response.json();
    //   })
    //   .then(data => console.log(data.name))
    //   .catch(error => console.error(error))
    // this.testPromise()
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
      //let number = Math.floor(Math.random()*20);
      /*
      const p = new Promise((resolve)=>{
        console.log('Am inceput promise')
        const x = prompt('Introduceti un numar par')
        if (Number.parseInt(x) % 2 === 0){
          resolve('Corect')
        }
      })
      console.log('ina nu am raspuns in promise')
      p.then(par=>{
        alert(par)
      }).catch(impar=>{
        alert(impar)
      })
      */
      /* a 2 varianta de Promise*/

      new Promise(function(resolve,reject) {
        const x = prompt('Introduceti un numar par')
        if (Number.parseInt(x) % 2 === 0){
          resolve('Corect')
        }else{
          reject('Incorect')
        }
      }).then( (resolve)=>{
        alert(resolve)
      }).catch( (error)=>{
        alert(error)
      })
    },

    async fetchData(){
      try{
        const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok){
          throw new Error('Could not fetch resource: https://pokeapi.co/api/v2/pokemon/typhlosion' + response.statusText);
        }
        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;

        const imgElement = document.getElementById('pokemonSprite');
        imgElement.src = pokemonSprite;
        imgElement.style.display= 'block';
      } catch(error){
        console.error(error);
      }
    },
    async getData() {
      const url = "https://example.org/products.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
    },
    generateRandomInteger(){
      return Math.floor(Math.random()*101);
    },
    isPrime(){
      return new Promise((resolve,reject)=>{
        // setTimeout(()=>{
          let number = this.generateRandomInteger();
          if (number < 2){
            reject("Number este mai mic ca 2. Nu este prim.");
          }else{
            for (let i = 2; i * i <= number; i++) {
              if(number % i === 0){
                reject( "Numarul nu este prim fiindca este divizivil cu " + i);
              }
            }
            resolve(number);
          }
        // },1500);
      });
    },
    cifraZecilor(numarPrim){
      return new Promise((resolve,reject)=>{
        // setTimeout(()=>{
          if (numarPrim >10){
            resolve("Cifra zecilor este: " + Math.floor(numarPrim/10)%10);
          }else{
            reject("Numarul nu este mai mare decat 10")
          }
        // },3000)%
      })
    },
    async testAsync(){
      try{
        let resultIsPrime = await this.isPrime();
        let resultCifraZecilor = await this.cifraZecilor(resultIsPrime);
        console.log(resultCifraZecilor);
      }catch(err){
        console.log(err);
      }
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

<!--  <p>Bun venit! Status login: {{this.login}}</p>-->
<!--  <button v-show="login">Retete</button>-->
<!--&lt;!&ndash;  <button @click="this.getData()">test</button>&ndash;&gt;-->
<!--  <button>Pacienti</button>-->
<!--  <br><br>-->

<!--  <input type="text" id="pokemonName" placeholder="Enter pokemon name: ">-->
<!--  <button @click="fetchData">Fetch Pokemon</button><br>-->
<!--  <img src="" alt="Pokemon Sprite" id="pokemonSprite" style="display: none">-->
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
