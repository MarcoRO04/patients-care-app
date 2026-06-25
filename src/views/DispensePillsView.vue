<script>
import PillsConfigurationTable from '@/components/PillsConfigurationTable.vue'

export default {
  name: 'DispensePillsView',
  components: { PillsConfigurationTable },
  mounted() {
    this.getRecipesListFromBE()
    console.log(this.$store.state.test_banda)
  },
  // setup(){
  //   const recipe_id = ref("--Alege pacient--")
  //   return {
  //     recipe_id,
  //   }
  // },

  data() {
    return {
      recipe_id: '',
      recipes_list: [],
      pills_configuration: "",
      active: false,
      config: false,
    }
  },
  methods: {
    load() {
      this.active = true
    },
    /*get the mockup list of patients from the BE*/
    /*get the list of recipes from the BE*/
    getRecipesListFromBE() {
      fetch('http://localhost:3001/recipes', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        /*Preflight si apoi raspunsul - e inca in pending*/
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          this.recipes_list = response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },

    getPillsConfigurationFromBE(id) {
      fetch(`http://localhost:3001/pills_configuration/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        /*Preflight si apoi raspunsul - e inca in pending*/
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          // console.log(this.recipes_list)
          this.pills_configuration =  response['result']
          this.getDispenseResponse(response['result']) // send string of digits to start sort
        })
        .catch(() => {
          alert('backend error')
        })
    },

    getDispenseResponse(type) {
      fetch(`http://localhost:3001/pills/test/${type}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((data) => {
          if (data['arduino']) {
            console.log(data['result'])
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
  },
}
</script>

<template>
  <div class="execution-box">
    <h1>Execution View</h1>
    <br />
    <select name="patients_mock-ups" v-model="this.recipe_id">
      <option>--Alege pacient--</option>
      <option v-for="(recipe, index) in this.recipes_list" :key="index" :value="recipe.id">
        {{ recipe.patient.name }}
      </option>
    </select>
    <br />
    <br />
    <button class="cancel-button" @click="goToRecipesView()">Return to Home</button>
    <button style="border: none" @click="getPillsConfigurationFromBE(recipe_id)">
      Dispense
    </button>
  </div>
  <!--  <button-->
  <!--    @click="getConfigFromBE()"-->
  <!--    :disabled="this.recipe_id.length === 0"-->
  <!--    class="config-tubes"-->
  <!--  >-->
  <!--    Configuratie tuburi-->
  <!--  </button>-->
  <div v-if="active" class="loader"></div>
  <!--  <video width="900px" height="600px" autoplay controls muted>-->
  <!--    <source src="../assets/simulareEroriSoftwarePrototip.mp4" type="video/mp4" />-->
  <!--    Your browser does not support the video type.-->
  <!--  </video>-->
</template>

<style scoped>
.execution-box {
  border: 1px solid black; /* Light grey */
  width: 34%;
  height: auto;
  text-align: center;
  margin: 20% auto auto;
}

select {
  background: white;
  width: 60%;
  font-size: 14px;
  padding: 12px 20px 12px 10px;
  border: 1px solid #ddd;
  margin-bottom: 18px;
  border-radius: 10px;
  margin-right: 15px;
}

.cancel-button {
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
  width: 120px;
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
  position: relative;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

.config-tubes {
  width: 150px;
  height: 30px;
  background-color: cornflowerblue;
}

.config-tubes:disabled {
  cursor: not-allowed;
  background-color: gray;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
