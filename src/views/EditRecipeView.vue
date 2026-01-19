<!--This view is used for changing two properties of the recipe: the doctor and the current prescription date.
Maybe the doctor of the recipe will change in the meantime or maybe the current date of the recipe will be chosen wrong.
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
        current_prescription_date: '',
        future_prescription_date: '',
        last_prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
        // renewed_today: '',
      },
      recipes_list: [],
      patients_list: [],
      doctors_list: [],
      edited_doctor_name: '',
      edited_current_prescription_date: '',
      min_d: '',
      max_d: '',
    }
  },
  updated() {
    this.check_recipe_modification()
  },
  methods: {
    // these functions for calculating the min and max values should work as
    // computed properties cause they have a reactive variable, current_prescription_date
    calculate_min_date() {
      let date_difference =
        Date.parse(this.recipe.current_prescription_date) - 30 * 24 * 60 * 60 * 1000
      this.min_d = new Date(date_difference).toISOString().split('T')[0] // current date - 30 days
    },
    calculate_max_date() {
      let date_difference =
        Date.parse(this.recipe.current_prescription_date) + 30 * 24 * 60 * 60 * 1000
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
      this.edited_current_prescription_date = this.formatDate(this.recipe.current_prescription_date)
    },

    /*Going back to RecipesView means firstly removing the recipe from localStorage
      and then pushing the RecipesView path*/
    goToRecipesView() {
      localStorage.removeItem('recipe')
      this.$router.push(`/recipes`)
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

    /*send an edit request with the recipe id in the path and the edited recipe in the body of the request*/
    sendEditRequestToBE() {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.recipe), // {recipe: this.recipe}
      })
        .then((d) => {
          // console.log(d.status)
          return d.json()
        })
        .then((response) => {
          if (response['result']) {
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
        this.recipe.current_prescription_date === this.edited_current_prescription_date
      )
    },
    /*if the user made a modification:
     * E.g.
     * - changed the doctor (then change the recipe's doctor to the new one)
     * or
     * - changed the current date (then change the recipe's current date and also calculate the new future recipe date and set it)
     *
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
        if (this.recipe.doctor.name !== this.edited_doctor_name) {
          this.recipe.doctor.name = this.edited_doctor_name
        }
        if (this.recipe.current_prescription_date !== this.edited_current_prescription_date) {
          this.recipe.current_prescription_date = this.edited_current_prescription_date
          this.recipe.future_prescription_date = this.calculateFuturePrescriptionDate(
            this.recipe.recipe_duration,
            this.recipe.current_prescription_date,
          )
          this.recipe.last_prescription_dates[this.recipe.last_prescription_dates.length - 1] =
            this.recipe.current_prescription_date
        }
        // console.log(this.recipe)
        this.sendEditRequestToBE()
        this.goToRecipesView()
      }
    },
    /*calculate the future prescription date of the recipe based on the current date and recipe duration*/
    calculateFuturePrescriptionDate(recipe_duration, current_prescription_date) {
      // I want that format in the combo box with "1 luna", "2 luni", that's why I want to do this.
      let recipe_period = []
      recipe_period = recipe_duration.split(' ')

      //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
      let future_prescription_date = new Date(
        Date.parse(current_prescription_date) + recipe_period[0] * 30 * 24 * 60 * 60 * 1000,
      )

      return this.formatDate(future_prescription_date)
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
        </option></select
      ><br />
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
  background-color: white;
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
</style>
