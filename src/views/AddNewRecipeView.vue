<!--View to add the details of a new recipe. All the recipe details will be selected and not typed, for usability purposes
    NOTE: recipe and prescription terms are used interchangeably
  -->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'AddNewRecipeView',
  components: { FontAwesomeIcon },
  mounted() {
    this.getPatientsListFromBE()
    this.getDoctorsListFromBE()
  },
  data() {
    return {
      recipe: {
        id: '',
        patient: {
          name: '',
        },
        doctor: {
          name: '',
          specialization: '',
        },
        recipe_duration: '',
        prescription_dates: [],
      },
      recipes_list: [],
      doctors_list: [],
      patients_list: [],
      recipe_periods_list: ['1 lună', '2 luni', '3 luni'],
      submission_ok: false,
    }
  },
  computed: {
    //these "computed properties functions" act as normal functions because Date.now() is not a reactive dependency
    calculate_min_date() {
      let current_date = Date.now()
      return new Date(current_date - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // current date - 30 days
    },
    calculate_max_date() {
      let current_date = Date.now()
      return new Date(current_date + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // current date + 30 days
    },
  },
  methods: {
    /*icon getter function*/
    faXmark() {
      return faXmark
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
    generateID() {
      return new Date().getTime().toString()
    },
    /*For the new recipe will need to do the following things:
     - generating a unique ID for the recipe
     - adding the chosen doctor to the recipe (name and specialization)

     The rest of the properties are set with the help of vue's two-way binding.

     and after all these steps were completed, then the recipe is POSTED to the BE
     and the list of recipes (RecipesView) will be displayed*/
    addNewRecipe() {
      this.recipe.id = this.generateID()
      //saving also the doctor's specialization
      for (let i = 0; i < this.doctors_list.length; i++) {
        if (this.recipe.doctor.name === this.doctors_list[i].name) {
          this.recipe.doctor.specialization = this.doctors_list[i].specialization
          break
        }
      }
      this.saveRecipeToBE()
      this.goToRecipesView()
    },

    /*sends a POST request to the BE with the new recipe as the body*/
    saveRecipeToBE() {
      fetch('http://localhost:3001/recipes/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.recipe),
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          if (response['status']) {
            console.log(response['rsp'])
          } else {
            console.log('There is no data in the response!')
          }
        })
        .catch((err) => console.log(err))
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
        })
        .catch(() => {
          alert('backend error')
        })
    },
    /*get the mockup list of doctors from the BE*/
    getDoctorsListFromBE() {
      fetch('http://localhost:3001/doctors', {
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
          this.doctors_list = response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },
    check_submission() {
      //all field have to be completed, to be true
      this.submission_ok =
        this.recipe.patient.name.length !== 0 &&
        this.recipe.doctor.name.length !== 0 &&
        this.recipe.recipe_duration.length !== 0 &&
      this.recipe.prescription_dates.length !== 0
    },
  },
}
</script>

<template>
  <div id="add_recipe_form" class="add_recipe_form">
    <div class="form-header">
      <h3 style="color: white; font-weight: bold">Adaugă rețetă nouă</h3>
      <button class="button-cancel-x" @click="goToRecipesView">
        <FontAwesomeIcon :icon="faXmark()" />
      </button>
    </div>
    <div style="padding: 5px 10px 10px 20px">
      <label for="patients_mock-ups">Selectează pacient:</label>
      <br />
      <select
        name="patients"
        id="patients_mock-ups"
        v-model="this.recipe.patient.name"
        @change="check_submission"
      >
        <option></option>
        <option v-for="(patient, index) in this.patients_list" :key="index">
          {{ patient.name }}
        </option>
      </select>

      <br />

      <label for="doctors_mock-ups">Selectează doctor:</label>
      <br />
      <select
        name="doctors"
        id="doctors_mock-ups"
        v-model="this.recipe.doctor.name"
        @change="check_submission"
      >
        <option></option>
        <option v-for="(doctor, index) in this.doctors_list" :key="index">{{ doctor.name }}</option>
      </select>

      <br />
      <label for="recipe_duration">Selectează durata rețetei:</label>
      <br />
      <select
        name="recipe_duration"
        id="recipe_duration"
        v-model="this.recipe.recipe_duration"
        @change="check_submission"
      >
        <option></option>
        <option v-for="(duration, index) in this.recipe_periods_list" :key="index">
          {{ duration }}
        </option>
      </select>

      <br />
      <label for="prescription_date">Alege data prescrierii rețetei:</label>
      <br />
      <input
        type="date"
        id="prescription_date"
        v-model="this.recipe.prescription_dates[0]"
        @change="check_submission"
        v-bind:min="calculate_min_date"
        v-bind:max="calculate_max_date"
      />

      <br />
      <br />

      <button class="cancel-button" @click="goToRecipesView()">Anulare</button>
      <button class="save-button" @click="addNewRecipe()" :disabled="this.submission_ok === false">
        Salvare
      </button>
      <br />
      <br />
    </div>
  </div>
</template>

<style scoped>
.form-header {
  background-color: #cf2e2e;
  color: white;
  font-weight: bold;
  padding: 10px 10px 10px 20px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
}
.add_recipe_form {
  width: 70%;
  height: 100%;
  margin: 100px auto;
  text-align: left;
  border: 2px solid black;
  background-color: white;
  color: black;
}
label {
  font-weight: bold;
}

input,
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

.button-cancel-x {
  background-color: transparent;
  color: white;
  border: none;
  height: 20px;
  text-align: right;
  margin-left: auto;
}
</style>
