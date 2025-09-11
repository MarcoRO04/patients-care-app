<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'EditRecipe',
  components: { FontAwesomeIcon },
  mounted() {
    let patients = localStorage.getItem('patients')
    let doctors = localStorage.getItem('doctors')
    let recipe_duration = localStorage.getItem('recipe_duration')

    if (doctors === '') {
      this.doctors_list = [
        { name: 'Dr. Mihai Elena', specialization: 'Neurolog' },
        { name: 'Dr. Ana Azuga', specialization: 'Psihiatru' },
        { name: 'Dr. Maria Blandiana', specialization: 'Neurolog' },
        { name: 'Dr. Alin Mircea', specialization: 'Psihiatru' },
      ]
      localStorage.setItem('doctors', JSON.stringify(this.doctors_list))
    } else if (doctors === null) {
      this.doctors_list = [
        { name: 'Dr. Mihai Elena', specialization: 'Neurolog' },
        { name: 'Dr. Ana Azuga', specialization: 'Psihiatru' },
        { name: 'Dr. Maria Blandiana', specialization: 'Neurolog' },
        { name: 'Dr. Alin Mircea', specialization: 'Psihiatru' },
      ]
      localStorage.setItem('doctors', JSON.stringify(this.doctors_list))
    } else {
      this.doctors_list = JSON.parse(doctors)
    }
    if (patients === '') {
      this.patients_list = [
        { name: 'Zora Chelici' },
        { name: 'Mirabela Jovic' },
        { name: 'Alin Mircea' },
        { name: 'Maria Popescu' },
      ]
      localStorage.setItem('patients', JSON.stringify(this.patients_list))
    } else if (patients === null) {
      this.patients_list = [
        { name: 'Zora Chelici' },
        { name: 'Mirabela Jovic' },
        { name: 'Alin Mircea' },
        { name: 'Maria Popescu' },
      ]
      localStorage.setItem('patients', JSON.stringify(this.patients_list))
    } else {
      this.patients_list = JSON.parse(patients)
    }
    if (recipe_duration === '') {
      this.recipe_periods_list = ['1 lună', '2 luni', '3 luni']
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else if (recipe_duration === null) {
      this.recipe_periods_list = ['1 lună', '2 luni', '3 luni']
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else {
      this.recipe_periods_list = JSON.parse(recipe_duration)
    }

    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
    this.initializeRecipe()
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
      },
      recipes_list: [],
      doctors_list: [],
      edited_doctor_name: '',
      edited_current_prescription_date: '',
    }
  },
  methods: {
    faXmark() {
      return faXmark
    },
    initializeRecipe() {
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].id === this.$route.params.id) {
          this.recipe.id = this.recipes_list[r].id
          this.recipe.patient.name = this.recipes_list[r].patient.name
          this.recipe.doctor.name = this.recipes_list[r].doctor.name
          this.recipe.doctor.specialization = this.recipes_list[r].doctor.specialization
          this.recipe.recipe_duration = this.recipes_list[r].recipe_duration
          this.recipe.current_prescription_date = this.recipes_list[r].current_prescription_date
          this.recipe.future_prescription_date = this.recipes_list[r].future_prescription_date
          this.recipe.last_prescription_dates = this.recipes_list[r].last_prescription_dates
          this.recipe.status = this.recipes_list[r].status
          this.recipe.distance_between_prescriptions =
            this.recipes_list[r].distance_between_prescriptions
          this.edited_doctor_name = this.recipes_list[r].doctor.name
          this.edited_current_prescription_date = this.recipes_list[r].current_prescription_date
          break
        }
      }
    },
    goToDetails() {
      this.$router.push(`/more_details_recipe/${this.recipe.id}`)
    },
    goToRecipesView() {
      this.$router.push(`/`)
    },
    saveEditedRecipe() {
      if (this.edited_doctor_name !== '' || this.edited_current_prescription_date !== '') {
        for (let r in this.recipes_list) {
          if (this.recipes_list[r].id === this.$route.params.id) {
            if (this.recipes_list[r].doctor.name !== this.edited_doctor_name) {
              this.recipes_list[r].doctor.name = this.edited_doctor_name
            }
            if (
              this.recipes_list[r].current_prescription_date !==
              this.edited_current_prescription_date
            ) {
              this.recipes_list[r].current_prescription_date = this.edited_current_prescription_date
              this.recipes_list[r].future_prescription_date = this.calculateFuturePrescriptionDate(
                this.recipes_list[r].recipe_duration,
                this.recipes_list[r].current_prescription_date,
              )
              this.recipes_list[r].last_prescription_dates[
                this.recipes_list[r].last_prescription_dates.length - 1
              ] = this.recipes_list[r].current_prescription_date
            }
            localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
            this.goToRecipesView()
            break
          }
        }
      } else {
        alert('Vă rugăm să completați cel puțin un câmp.')
      }
    },
    calculateFuturePrescriptionDate(recipe_duration, current_prescription_date) {
      // I want that format in the combo box with "1 luna", "2 luni", that's why I want to do this.
      let recipe_period = []
      recipe_period = recipe_duration.split(' ')

      //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
      let future_prescription_date = new Date(
        Date.parse(current_prescription_date) + recipe_period[0] * 30 * 24 * 60 * 60 * 1000,
      )

      return future_prescription_date
    },
  },
}
</script>

<template>
  <div class="edit-recipe-form">
    <div class="edit-header">
      <h3 style="font-size: 17px;font-weight: bold">Editare date pacient</h3>
      <button class="button-cancel-x" @click="goToDetails">
        <FontAwesomeIcon :icon="faXmark()" />
      </button>
    </div>
    <div class="edit-form-content">
      <div class="divs-paragraph-problem">
        <p class="label-problem">Pacient:</p>
        <p>{{ this.recipe.patient.name }}</p>
      </div>
      <div class="divs-paragraph-problem">
        <p class="label-problem" style="margin-bottom: 10px">Tip rețetă:</p>
        <p>{{ this.recipe.doctor.specialization }}</p>
      </div>
      <label style="font-weight: bold" for="edit-last-date">Schimbă ultima dată:</label><br />
      <input type="date" id="edit-last-date" v-model="this.edited_current_prescription_date" /><br />
      <label style="font-weight: bold">Alege alt doctor:</label><br />
      <select v-model="this.edited_doctor_name">
        <option></option>
        <option v-for="(doctor, index) in this.doctors_list" :key="index">
          {{ doctor.name }}
        </option></select
      ><br />
      <button class="cancel-edit-btn" @click="goToDetails">Anulează</button>
      <button class="save-edit-btn" @click="saveEditedRecipe">Salvează</button>
    </div>
  </div>
</template>

<style scoped>
.edit-header{
  background-color: #cf2e2e;
  padding-left: 15px;
  color: white;
  font-weight: bold;
  position: relative;
  display: flex;
}
.button-cancel-x{
  background-color: transparent;
  color: white;
  border: none;
  height: 20px;
  text-align: right;
  margin-left: auto;
}

.edit-form-content{
  padding: 5px 15px;
}
/*It didn't let me to do just a part of the paragraph bold, so I did this:*/
/*-----------------------*/
.divs-paragraph-problem {
  display: flex;
  position: relative;
}
.label-problem {
  margin-right: 7px;
  font-weight: bold;
}
/*----------------------*/
.edit-recipe-form {
  width: 300px;
  margin: 100px auto;
  border: 2px solid black;
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

input, select {
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
