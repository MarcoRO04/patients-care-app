<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'AddNewRecipeView',
  components: { FontAwesomeIcon },
  mounted() {
    this.getPatientsListFromBE()
    this.getDoctorsListFromBE()
    let recipe_duration = localStorage.getItem('recipe_duration')
    if (recipe_duration === '') {
      this.recipe_periods_list = ['1 lună', '2 luni', '3 luni']
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else if (recipe_duration === null) {
      this.recipe_periods_list = ['1 lună', '2 luni', '3 luni']
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else {
      this.recipe_periods_list = JSON.parse(recipe_duration)
    }
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
        future_prescription_date: '',
        current_prescription_date: '',
        recipe_duration: '',
        last_prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
        renewed_today: '',
      },
      recipes_list: [],
      doctors_list: [],
      patients_list: [],
      recipe_periods_list: [],
      submission_ok: false,
      test_recipe_list: [],
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
    faXmark() {
      return faXmark
    },
    checkIDGeneration() {
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].id === this.recipe.id) {
          this.recipe.id = this.generateID()
          console.log('I thought it was impossible to generate the same ID.')
        }
      }
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
    generateID() {
      return new Date().getTime().toString()
    },
    initializeNewRecipe() {
      this.calculateFuturePrescriptionDate()
      this.recipe.last_prescription_dates.push(this.recipe.current_prescription_date)
      this.recipe.id = this.generateID()
      this.checkIDGeneration()
      this.recipe.renewed_today = false
      //saving also the doctor's specialization
      for (let i = 0; i < this.doctors_list.length; i++) {
        if (this.recipe.doctor.name === this.doctors_list[i].name) {
          this.recipe.doctor.specialization = this.doctors_list[i].specialization
          break
        }
      }
      // let new_recipe = this.recipe
      this.recipes_list.push(this.recipe)
    },
    saveRecipeToBE() {
      this.initializeNewRecipe()
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
            this.goToRecipesView()
          } else {
            console.log('There is no data in the response!')
          }
        })
        .catch((err) => console.log(err))
    },
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
        this.recipe.current_prescription_date.length !== 0 &&
        this.calculateFuturePrescriptionDate() &&
        this.check_recipe_existence()
    },
    calculateFuturePrescriptionDate() {
      // I want that format in the combo box with "1 luna", "2 luni", that's why I want to do this.
      let recipe_period = []
      recipe_period = this.recipe.recipe_duration.split(' ')

      //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
      this.recipe.future_prescription_date = new Date(
        Date.parse(this.recipe.current_prescription_date) +
          recipe_period[0] * 30 * 24 * 60 * 60 * 1000,
      )
      console.log(this.recipe.future_prescription_date)

      // I could do it a lot simpler by multiplying 30 to the recipe_duration.

      // The current method will be more useful for RecipeView.vue where I have to calculate it each day.
      if (Date.parse(this.recipe.future_prescription_date) > Date.now()) {
        const dates_difference = Date.parse(this.recipe.future_prescription_date) - Date.now()
        const day = 8.64e7 // how many milliseconds in a day

        //set the initial difference between dates (it will be changed later, every day)
        this.recipe.distance_between_prescriptions = Math.round(dates_difference / day)
        // the status should be always '3'
        // but if, idk, the recipe was prescribed 2-3 weeks ago, we check it, and put the status accordingly
        if (
          this.recipe.distance_between_prescriptions >= 0 &&
          this.recipe.distance_between_prescriptions <= 7
        ) {
          //red
          this.recipe.status = '1'
        } else if (
          this.recipe.distance_between_prescriptions >= 8 &&
          this.recipe.distance_between_prescriptions <= 14
        ) {
          //orange
          this.recipe.status = '2'
        } else {
          //green
          this.recipe.status = '3'
        }
        return true
      } else {
        alert(
          'Nu poți adăuga o rețetă unde data următoare de prescriere a rețetei este mai mică decât ziua curentă!',
        )
        return false
      }
    },
    check_recipe_existence() {
      for (let r in this.recipes_list) {
        if (this.recipe.patient.name === this.recipes_list[r].patient.name) {
          if (this.recipe.doctor.name === this.recipes_list[r].doctor.name) {
            alert('Nu poți să ai două rețete de același tip la același medic')
            return false
          }
        }
      }
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
        v-model="this.recipe.current_prescription_date"
        @change="check_submission"
        v-bind:min="calculate_min_date"
        v-bind:max="calculate_max_date"
      />

      <br />
      <br />

      <button class="cancel-button" @click="goToRecipesView">Anulare</button>
      <button class="save-button" @click="saveRecipeToBE" :disabled="this.submission_ok === false">
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
