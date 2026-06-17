<script>

export default {
  name: 'DispensePillsView',
  components: {},
  mounted() {
    this.getPatientsListFromBE()
    console.log(this.$store.state.test_banda)
  },
  // setup(){
  //   const patient_name = ref("--Alege pacient--")
  //   return {
  //     patient_name,
  //   }
  // },

  data() {
    return {
      patient_name: '',
      patients_list: [],
      active: false,
      config: false,
    }
  },
  methods: {
    load() {
      this.active = true
    },
    /*get the mockup list of patients from the BE*/
    getPatientsListFromBE() {
      fetch('http://localhost:3001/patients', {
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
          this.patients_list = response['list']
          console.log(this.patients_list)
        })
        .catch(() => {
          alert('backend error')
        })
    },

    getConfigFromBE() {
      fetch('http://localhost:3001/pills/config', {
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
          this.config = response['config']
          console.log(response)
        })
        .catch(() => {
          alert('backend error')
        })
    },
  },
}
</script>

<template>
  <h1>Execution View</h1>
  <select name="patients_mock-ups" v-model="this.patient_name">
    <option>--Alege pacient--</option>
    <option v-for="(patient, index) in this.patients_list" :key="index" :value="patient.name">
      {{ patient.name }}
    </option>
  </select>
  <br />
  <br />
  <button v-if="config" @click="load">Dispense</button>
  <button @click="getConfigFromBE()" :disabled="this.patient_name.length === 0" class="config-tubes">
    Configuratie tuburi
  </button>
  <div v-if="active" class="loader"></div>
  <!--  <video width="900px" height="600px" autoplay controls muted>-->
  <!--    <source src="../assets/simulareEroriSoftwarePrototip.mp4" type="video/mp4" />-->
  <!--    Your browser does not support the video type.-->
  <!--  </video>-->
</template>

<style scoped>
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
