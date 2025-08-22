<script>
import { isDisabled } from 'jsdom/lib/jsdom/living/helpers/form-controls.js'

export default {
  name: 'EditRecipe',
  components: {},
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
  },

  data() {
    return {
      recipe: {
        id: this.$route.params.id,
        patient: {
          name: this.$route.params.patient_name,
        },
        doctor: {
          name: this.$route.params.doctor_name,
          specialization: this.$route.params.doctor_specialization,
        },
        recipe_duration: this.$route.params.recipe_duration,
        current_prescription_date: this.$route.params.current_prescription_date,
        future_prescription_date: this.$route.params.future_prescription_date,
        last_prescription_dates: this.$route.params.last_prescription_dates,
        status: this.$route.params.status,
        distance_between_recipes: this.$route.params.distance_between_recipes,
      },
      recipes_list: [],
      doctors_list: [],
      edited_doctor_name: this.$route.params.doctor_name,
      edited_current_prescription_date: this.$route.params.current_prescription_date,
    }
  },
  methods: {
    goToDetails() {
      this.$router.push(
        `/more_details_recipe/${this.recipe.id}/${this.recipe.patient.name}/${this.recipe.doctor.name}/${this.recipe.doctor.specialization}/${this.recipe.recipe_duration}/${this.recipe.distance_between_recipes}/${this.recipe.last_prescription_dates}/${this.recipe.current_prescription_date}/${this.recipe.future_prescription_date}/${this.recipe.status}`,
      )
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
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
              this.recipes_list[r].future_prescription_date = this.calculateFuturePrescriptionDate(this.recipes_list[r].recipe_duration, this.recipes_list[r].current_prescription_date)
            }
            localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
            this.goToRecipesView()
            break;
          }
        }
      }else{
        alert("Vă rugăm să completați cel puțin un câmp.")
      }
    },
    calculateFuturePrescriptionDate(recipe_duration,current_prescription_date) {
      // I want that format in the combo box with "1 luna", "2 luni", that's why I want to do this.
      let recipe_period = []
      recipe_period = recipe_duration.split(' ')

      //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
      let future_prescription_date = new Date(
        Date.parse(current_prescription_date) +
          recipe_period[0] * 30 * 24 * 60 * 60 * 1000,
      )
      console.log(future_prescription_date)

      return future_prescription_date
    },
  },
}
</script>

<template>
  <div class="edit-recipe-form">
    <h3>Date pacient:</h3>
    <p>Pacient: {{ this.recipe.patient.name }}</p>
    <p>Tip rețetă: {{ this.recipe.doctor.specialization }}</p>
    <p>Doctor: {{ this.recipe.doctor.name }}</p>
    <p>Ultima data: {{ this.recipe.current_prescription_date }}</p>
    <br />
    <h3>Editează:</h3>
    <label for="edit-last-date">Schimbă ultima dată:</label><br />
    <input type="date" id="edit-last-date" v-model="edited_current_prescription_date" /><br />
    <label>Alege alt doctor:</label><br />
    <select v-model="edited_doctor_name">
      <option></option>
      <option v-for="(doctor, index) in this.doctors_list" :key="index">
        {{ doctor.name }}
      </option></select
    ><br />
    <button class="cancel-edit-btn" @click="goToDetails">Anulează</button>
    <button
      class="save-edit-btn"
      @click="saveEditedRecipe"
    >
      Salvează
    </button>
  </div>
</template>

<style scoped>
.edit-recipe-form {
  width: 300px;
  margin: 100px auto;
  padding: 5px 10px;
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
  border: none;
  opacity: 0.9;
}

.cancel-edit-btn {
  margin-top: 20px;
  background-color: darkgray;
}

.save-edit-btn {
  background-color: dodgerblue;
}

button:hover {
  opacity: 1;
}
</style>
