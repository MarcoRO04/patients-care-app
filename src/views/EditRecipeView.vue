<!--This view is used for changing two properties of the prescription:
the doctor, the current prescription date or the quantity of pills that a patient need to take during different parts of the day.
Maybe the doctor of the prescription will change in the meantime or maybe the current date of the prescription will be chosen wrong,
or the pills quantity will be set wrong.
To modify details about patients and doctors, the admin can acces the patients and doctors views to do so (those views are not yet implemented)
-->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'EditRecipe',
  components: { FontAwesomeIcon },
  mounted() {
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

    this.initializeRecipe()
    this.calculate_min_date()
    this.calculate_max_date()
    this.getRecipesListFromBE()
  },

  data() {
    return {
      recipe: {
        id: this.$route.params.id,
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
      edited_doctor_name: '',
      edited_current_prescription_date: '',
      min_d: '',
      max_d: '',

      initial_pills_table: [],
      pills_table: [],
      morning: [],
      lunch: [],
      dinner: [],
      before_bed: [],

      pills_distribution: {},
      morning_distribution: '',
      lunch_distribution: '',
      dinner_distribution: '',
      before_bed_distribution: '',
    }
  },
  updated() {
    this.check_recipe_modification()
  },
  methods: {
    // these functions for calculating the min and max values should work as
    // computed properties cause they have a reactive variable, prescription_dates[last_date]
    calculate_min_date() {
      let date_difference =
        Date.parse(this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1]) -
        30 * 24 * 60 * 60 * 1000
      this.min_d = new Date(date_difference).toISOString().split('T')[0] // current date - 30 days
    },
    calculate_max_date() {
      let date_difference =
        Date.parse(this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1]) +
        30 * 24 * 60 * 60 * 1000
      this.max_d = new Date(date_difference).toISOString().split('T')[0] // current date + 30 days
    },
    /*icon getter function*/
    faXmark() {
      return faXmark
    },
    /*Initializing the recipe from localStorage (it was set by the RecipeCard)*/
    initializeRecipe() {
      let r = localStorage.getItem('recipe')
      if (r) {
        this.recipe = JSON.parse(r)
      }
      this.edited_doctor_name = this.recipe.doctor.name
      this.edited_current_prescription_date = this.formatDate(
        this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1],
      )
      this.getPillsConfigurationFromBE(this.recipe.id)
    },

    /*Going back to RecipesView means firstly removing the recipe from localStorage
      and then pushing the RecipesView path*/
    goToRecipesView() {
      localStorage.removeItem('recipe')
      this.$router.push(`/recipes`)
    },

    getRecipesListFromBE() {
      fetch('http://localhost:3001/recipes', {
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

    /*send an edit request with the recipe id in the path and the edited recipe in the body of the request*/
    sendEditRequestToBE(shortFormRecipe) {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shortFormRecipe),
      })
        .then((d) => {
          return d.json()
        })
        .then((response) => {
          if (response['status']) {
            alert('Update ok!')
          } else {
            alert('Failed update recipe')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    /*this function is used in the updated() hook to see if the user changed something to the recipe (the virtual DOM will be updated)*/
    check_recipe_modification() {
      return (
        this.recipe.doctor.name === this.edited_doctor_name &&
        this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1] ===
          this.edited_current_prescription_date &&
        this.check_pill_distribution_modification()
      )
    },

    check_pill_distribution_modification() {
      for (let index = 0; index < this.pills_table.length; index++) {
        if (
          this.pills_table[index].morning_pill_number ===
            this.initial_pills_table[index].morning_pill_number &&
          this.pills_table[index].lunch_pill_number ===
            this.initial_pills_table[index].lunch_pill_number &&
          this.pills_table[index].dinner_pill_number ===
            this.initial_pills_table[index].dinner_pill_number &&
          this.pills_table[index].before_bed_pill_number ===
            this.initial_pills_table[index].before_bed_pill_number
        ) {
          return true
        }
      }
      return false
    },
    /*if the user made a modification:
     * E.g.
     * - changed the doctor (then change the recipe's doctor to the new one)
     * or
     * - changed the current date (then change the recipe's current date) - the future_date calculation will be handled by the BE
     * when the list of recipes is retrieved)
     * or
     * - change a pill quantity from the pills distribution table
     * when the update button is pressed, a PUT request will be sent to the BE, to save the updated recipe
     * then RecipesView will be pushed, to see the modified recipe in the list of recipes
     *
     * RecipesView will display the updated recipe, because the list of recipes will be fetched again, while the view is rendering.
     *
     * */
    saveEditedRecipe() {
      if (this.check_recipe_modification()) {
        alert('Nu ați făcut nicio modificare!')
      } else {
        if (
          this.recipe.doctor.name !== this.edited_doctor_name
        ) {
          this.recipe.doctor.name = this.edited_doctor_name
        }
        if (
          this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1] !==
          this.edited_current_prescription_date
        ) {
          this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1] =
            this.edited_current_prescription_date
        }
        // console.log(this.recipe)
        this.computePillDistributionForDB()

        let shortFormRecipe = {}
        shortFormRecipe.id = this.recipe.id
        shortFormRecipe.doctor = this.recipe.doctor
        shortFormRecipe.patient = this.recipe.patient
        shortFormRecipe.recipe_duration = this.recipe.recipe_duration
        shortFormRecipe.prescription_dates = this.recipe.prescription_dates
        shortFormRecipe.pills_distribution = this.pills_distribution

        this.sendEditRequestToBE(shortFormRecipe)
        this.goToRecipesView()
      }
    },
    formatDate(date_string) {
      let date = new Date(date_string)
      let formatted_date = ''
      if (date.getMonth() + 1 < 10 && date.getDate() >= 10) {
        formatted_date = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
      } else if (date.getDate() < 10 && date.getMonth() + 1 >= 10) {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
      } else if (date.getDate() < 10 && date.getMonth() + 1 < 10) {
        formatted_date = `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`
      } else {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }
      return formatted_date
    },
    getPillsConfigurationFromBE(id) {
      fetch(`http://localhost:3001/pills/pills_configuration/${id}`, {
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
          //console.log(response['result'][0]['morning'].split('#'))
          this.morning = response['result'][0]['morning'].split('#')
          //console.log(response['result'][0]['lunch'].split('#'))
          this.lunch = response['result'][0]['lunch'].split('#')
          //console.log(response['result'][0]['dinner'].split('#'))
          this.dinner = response['result'][0]['dinner'].split('#')
          //console.log(response['result'][0]['before_bed'].split('#'))
          this.before_bed = response['result'][0]['before_bed'].split('#')
          // this.pills_configuration = response['result'][0]
          this.computeData()
        })
        .catch(() => {
          alert('backend error pills configuration table')
        })
    },
    computeData() {
      for (let index = 0; index < this.morning.length; index++) {

        let row = {
          id: '',
          name: '',
          morning_pill_number: '0',
          lunch_pill_number: '0',
          dinner_pill_number: '0',
          before_bed_pill_number: '0',
        }

        row.id = this.morning[index].split(':')[0]
        row.name = this.getPillName(this.morning[index].split(':')[0])
        row.morning_pill_number = this.morning[index].split(':')[1]
        row.lunch_pill_number = this.lunch[index].split(':')[1]
        row.dinner_pill_number = this.dinner[index].split(':')[1]
        row.before_bed_pill_number = this.before_bed[index].split(':')[1]

        this.pills_table.push(row)
      }
      for (let index = 0; index < this.pills_table.length; index++) {
        let newPill = {
          id: this.pills_table[index].id,
          name: this.pills_table[index].name,
          morning_pill_number: this.pills_table[index].morning_pill_number,
          lunch_pill_number: this.pills_table[index].lunch_pill_number,
          dinner_pill_number: this.pills_table[index].dinner_pill_number,
          before_bed_pill_number: this.pills_table[index].before_bed_pill_number,
        }
        this.initial_pills_table.push(newPill)
      }
    },
    getPillName(id) {
      for (let index = 0; index < this.$store.state.pills_collection.length; index++) {
        if (this.$store.state.pills_collection[index].id === id) {
          return this.$store.state.pills_collection[index].name
        }
      }
    },
    computePillDistributionForDB() {
      for (let index = 0; index < this.pills_table.length; index++) {
        if (index === this.pills_table.length - 1) {
          this.morning_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].morning_pill_number
          this.lunch_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].lunch_pill_number
          this.dinner_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].dinner_pill_number
          this.before_bed_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].before_bed_pill_number
        } else {
          this.morning_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].morning_pill_number + '#'
          this.lunch_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].lunch_pill_number + '#'
          this.dinner_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].dinner_pill_number + '#'
          this.before_bed_distribution +=
            this.pills_table[index].id + ':' + this.pills_table[index].before_bed_pill_number + '#'
        }
      }
      this.pills_distribution.morning = this.morning_distribution
      this.pills_distribution.lunch = this.lunch_distribution
      this.pills_distribution.dinner = this.dinner_distribution
      this.pills_distribution.before_bed = this.before_bed_distribution
    },
  },
}
</script>

<template>
  <div class="edit-recipe-form">
    <div class="edit-header">
      <h3 style="font-size: 17px; font-weight: bold">Editare date pacient</h3>
      <button class="button-cancel-x" @click="goToRecipesView">
        <FontAwesomeIcon :icon="faXmark()" />
      </button>
    </div>
    <div class="edit-form-content">
      <p><span style="font-weight: bold">Pacient: </span> {{ this.recipe.patient.name }}</p>
      <p>
        <span style="font-weight: bold">Tip rețetă: </span> {{ this.recipe.doctor.specialization }}
      </p>
      <br />

      <label style="font-weight: bold" for="edit-last-date">Schimbă ultima dată:</label><br />
      <input
        type="date"
        id="edit-last-date"
        :min="min_d"
        :max="max_d"
        v-model="this.edited_current_prescription_date"
      /><br />
      <label style="font-weight: bold">Alege alt doctor:</label><br />
      <select v-model="this.edited_doctor_name">
        <option></option>
        <option v-for="(doctor, index) in this.doctors_list" :key="index">
          {{ doctor.name }}
        </option>
      </select>

      <p style="font-weight: bold; margin-top: 10px; margin-bottom: 6px">
        Schimbă distribuția pastilelor:
      </p>
      <div>
        <table>
          <tbody>
            <tr>
              <th>Nr. crt.</th>
              <th>Denumire</th>
              <th>Dimineața</th>
              <th>Prânz</th>
              <th>Cina</th>
              <th>Înainte de culcare</th>
            </tr>
            <tr v-for="(pill, index) in pills_table" :key="index">
              <td>{{ index + 1 }}.</td>
              <td>{{ pill.name }}</td>
              <td>
                <div style="width: 80px; margin-right: 10px">
                  <input
                    v-model="pill.morning_pill_number"
                    type="number"
                    id="morning_number_of_pills1"
                    value="0"
                    min="0"
                    max="5"
                    style="width: 70px"
                  />
                </div>
              </td>
              <td>
                <div style="width: 80px; margin-right: 10px">
                  <input
                    v-model="pill.lunch_pill_number"
                    type="number"
                    id="lunch_number_of_pills1"
                    value="0"
                    min="0"
                    max="5"
                    style="width: 70px"
                  />
                </div>
              </td>
              <td>
                <div style="width: 80px; margin-right: 10px">
                  <input
                    v-model="pill.dinner_pill_number"
                    type="number"
                    id="dinner_number_of_pills1"
                    value="0"
                    min="0"
                    max="5"
                    style="width: 70px"
                  />
                </div>
              </td>
              <td>
                <div style="width: 140px; margin-right: 10px">
                  <input
                    v-model="pill.before_bed_pill_number"
                    type="number"
                    id="before_bed_number_of_pills1"
                    value="0"
                    min="0"
                    max="5"
                    style="width: 70px"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <button class="cancel-edit-btn" @click="goToRecipesView">Anulează</button>
      <button class="save-edit-btn" @click="saveEditedRecipe">Salvează</button>
    </div>
  </div>
</template>

<style scoped>
.edit-header {
  background-color: #cf2e2e;
  padding-left: 15px;
  color: white;
  font-weight: bold;
  position: relative;
  display: flex;
}
.button-cancel-x {
  background-color: transparent;
  color: white;
  border: none;
  height: 20px;
  text-align: right;
  margin-left: auto;
}

.edit-form-content {
  padding: 5px 15px;
}

.edit-recipe-form {
  width: 100%;
  height: 100%;
  margin: auto;
  color: black;
}

button {
  width: 80px;
  height: 33px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 3px;
  opacity: 0.9;
}

.cancel-edit-btn {
  margin-top: 20px;
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
}

.save-edit-btn {
  background-color: #cf2e2e;
  border: none;
}

button:hover {
  opacity: 1;
}

input,
select {
  background: white;
  width: 70%;
  font-size: 14px;
  padding: 12px 20px 12px 10px;
  border: 1px solid #ddd;
  margin-bottom: 7px;
  border-radius: 10px;
  margin-right: 15px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
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
