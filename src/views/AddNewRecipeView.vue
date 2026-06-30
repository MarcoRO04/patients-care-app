<!--View to add the details of a new recipe. All the recipe details will be selected and not typed,
    for usability purposes.
    NOTE: recipe and prescription terms are used interchangeably
  -->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'AddNewRecipeView',
  components: { FontAwesomeIcon },
  mounted() {
    this.getPatientsListFromBE()
    this.getDoctorsListFromBE()
    this.getRecipesListFromBE()

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
        recipe_duration: '',
        prescription_dates: [],
        pills_list: [],
      },
      pill: {
        id: '',
        name: '',
        morning: 0,
        lunch: 0,
        dinner: 0,
        before_bed: 0,
      },
      pill_index: -1,
      pill_cod_selected: '',
      doctors_list: [],
      patients_list: [],
      recipes_list: [],
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
    faTrashCan() {
      return faTrashCan
    },
    faPlus() {
      return faPlus
    },
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
    checkPatientDoctorExistence(patient_name, doctor_name) {
      for (let recipe in this.recipes_list) {
        if (
          this.recipes_list[recipe].patient.name === patient_name &&
          this.recipes_list[recipe].doctor.name === doctor_name
        ) {
          return true
        }
      }
      return false
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
      if (this.checkPatientDoctorExistence(this.recipe.patient.name, this.recipe.doctor.name)) {
        alert(
          `Pacientul ${this.recipe.patient.name} are deja rețetă la ${this.recipe.doctor.name}.`,
        )
      } else {
        this.saveRecipeToBE()
        this.goToRecipesView()
      }
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
            console.log(response['rsp'])
          }
        })
        .catch((err) => console.log(err))
    },

    /*get the mockup list of patients from the BE*/
    getListFromBE(query) {
      fetch(`http://localhost:3001/${query}`, {
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
          return response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },
    getPillsListFromBE() {
      fetch('http://localhost:3001/pills', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          // console.log(this.recipes_list)
          this.pills_collection_xls = response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },
    getPatientsListFromBE() {
      fetch('http://localhost:3001/patients', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
    /*get the mockup list of doctors from the BE*/
    getDoctorsListFromBE() {
      fetch('http://localhost:3001/doctors', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
    isActiveAddBtnPill() {
      return (
        this.pill_index >= 0 &&
        (this.pill.morning !== 0 ||
          this.pill.lunch !== 0 ||
          this.pill.dinner !== 0 ||
          this.pill.before_bed !== 0)
      )
    },
    addNewPillToList() {
      const new_pill = {
        id: this.$store.state.pills_collection[this.pill_index].id,
        name: this.$store.state.pills_collection[this.pill_index].name,
        morning: this.pill.morning,
        lunch: this.pill.lunch,
        dinner: this.pill.dinner,
        before_bed: this.pill.before_bed,
      }
      this.recipe.pills_list.push(new_pill)
      this.pill_index = -1

      this.pill.id = ''
      this.pill.name = ''
      this.pill.morning = 0
      this.pill.lunch = 0
      this.pill.dinner = 0
      this.pill.before_bed = 0
    },
    deletePillFromList(index) {
      if (index > -1) {
        // only splice array when item is found
        this.recipe.pills_list.splice(index, 1) // 2nd parameter means remove one item only
      }
    },
  },
}
</script>

<template>
  <div id="add_recipe_form" class="add_recipe_form">
    <div class="form-header">
      <h3 style="color: white; font-weight: bold">Adaugă rețetă nouă</h3>
      <button class="button-cancel-x" @click="goToRecipesView()">
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

      <p style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px">
        Adaugă medicament:
      </p>
      <div
        v-show="this.recipe.pills_list.length < 5"
        id="pill_prescription_row1"
        style="display: flex"
      >
        <div style="width: 200px">
          <label for="drug_name1">Denumire medicament</label> <br />
          <!--          <input type="text" id="drug_name1" style="width: 160px" v-model="this.pill.name" />-->
          <select v-model="this.pill_index">
            <option disabled value="">Te rog selectează codul medicamentului</option>
            <option
              v-for="(pill, index) in this.$store.state.pills_collection"
              :key="index"
              :value="index"
            >
              {{ pill.name }}
            </option>
          </select>
        </div>
        <div style="width: 80px; margin-right: 10px">
          <label for="morning_number_of_pills1">Dimineața</label> <br />
          <input
            v-model="this.pill.morning"
            type="number"
            id="morning_number_of_pills1"
            value="0"
            min="0"
            max="5"
            style="width: 70px"
          />
        </div>

        <div style="width: 80px; margin-right: 10px">
          <label for="lunch_number_of_pills1">Prânz</label> <br />
          <input
            v-model="this.pill.lunch"
            type="number"
            id="lunch_number_of_pills1"
            value="0"
            min="0"
            max="5"
            style="width: 70px"
          />
        </div>

        <div style="width: 80px; margin-right: 10px">
          <label for="dinner_number_of_pills1">Cina</label> <br />
          <input
            v-model="this.pill.dinner"
            type="number"
            id="dinner_number_of_pills1"
            value="0"
            min="0"
            max="5"
            style="width: 70px"
          />
        </div>

        <div style="width: 140px; margin-right: 10px">
          <label for="before_bed_number_of_pills1">Înainte de culcare</label> <br />
          <input
            v-model="this.pill.before_bed"
            type="number"
            id="before_bed_number_of_pills1"
            value="0"
            min="0"
            max="5"
            style="width: 70px"
          />
        </div>
        <div style="text-align: center; margin-top: 20px">
          <button
            class="add-new-pill-row-btn"
            @click="addNewPillToList()"
            v-show="this.recipe.pills_list.length < 5"
            :disabled="!this.isActiveAddBtnPill()"
          >
            <FontAwesomeIcon :icon="faPlus()" />
          </button>
          <br />
        </div>
      </div>
      <br />

      <p style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px">
        Distribuție pastile:
      </p>
      <p
        v-if="this.recipe.pills_list.length === 0"
        style="font-size: 16px; margin-top: 30px; margin-bottom: 15px"
      >
        Momentan nu a fost niciun medicament adăugat.
      </p>
      <div v-show="this.recipe.pills_list.length > 0">
        <table>
          <colgroup>
            <col span="6" style="background-color: white" />
            <col span="7" style="border: 1px solid white" />
          </colgroup>
          <tbody>
            <tr>
              <th>Nr. crt.</th>
              <th>Denumire</th>
              <th>Dimineața</th>
              <th>Prânz</th>
              <th>Cina</th>
              <th>Înainte de culcare</th>
              <th></th>
            </tr>
            <tr v-for="(pill, index) in this.recipe.pills_list" :key="index">
              <td>{{ index + 1 }}.</td>
              <td>{{ pill.name }}</td>
              <td>{{ pill.morning }}</td>
              <td>{{ pill.lunch }}</td>
              <td>{{ pill.dinner }}</td>
              <td>{{ pill.before_bed }}</td>
              <td>
                <button @click="deletePillFromList(index)">
                  <FontAwesomeIcon :icon="faTrashCan()"></FontAwesomeIcon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  width: 100%;
  height: 100%;
  text-align: left;
  background-color: white;
  margin: auto;
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

.save-button:disabled {
  cursor: not-allowed;
  background-color: #555555;
}

.button-cancel-x {
  background-color: transparent;
  color: white;
  border: none;
  height: 20px;
  text-align: right;
  margin-left: auto;
}

.add-new-pill-row-btn {
  background-color: white;
  color: black;
  border-color: #cf2e2e;
  font-size: 17px;
  font-weight: bolder;
}

.add-new-pill-row-btn:disabled {
  background-color: #555555;
  border: none;
  cursor: not-allowed;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th {
  font-weight: bold;
}
</style>
