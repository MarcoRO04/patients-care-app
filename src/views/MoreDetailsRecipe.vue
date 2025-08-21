<script>
export default {
  name: 'MoreDetailRecipe',
  components: {},
  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
    console.log(this.$route.params.distance_between_recipes)
  },
  data() {
    return {
      recipe: {
        patient: {
          name: this.$route.params.patient_name,
        },
        doctor: {
          name: this.$route.params.doctor_name,
          specialization: this.$route.params.doctor_specialization,
        },
        future_prescription_date: this.$route.params.future_prescription_date,
        current_prescription_date: this.$route.params.current_prescription_date,
        recipe_duration: this.$route.params.recipe_duration,
        last_prescription_dates: this.$route.params.last_prescription_dates.split(','),
        status: this.$route.params.status,
        distance_between_prescriptions: this.$route.params.distance_between_recipes,
      },
      recipes_list: [],
      showModal: false,
    }
  },
  methods: {
    formatDate(date_string) {
      let date = new Date(date_string)
      let formatted_date = ''
      if (date.getMonth() < 10 && date.getDate() > 10) {
        formatted_date = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
      } else if (date.getDate() < 10 && date.getMonth() > 10) {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
      } else {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }
      return formatted_date
    },
    calculateFuturePrescriptionDate() {
      for (let r in this.recipes_list) {
        if (
          this.$route.params.patient_name === this.recipes_list[r].patient.name &&
          this.$route.params.doctor_name === this.recipes_list[r].doctor.name &&
          this.$route.params.recipe_duration === this.recipes_list[r].recipe_duration
        ) {
          this.recipes_list[r].recipe_duration.split(' ')
          let unformatted_current_date = new Date(Date.now())
          this.recipes_list[r].current_prescription_date =
            `${unformatted_current_date.getFullYear()}-${unformatted_current_date.getMonth() + 1}-${unformatted_current_date.getDate()}`
          let unformatted_future_date = new Date(
            Date.now() + this.recipes_list[r].recipe_duration[0] * 1000 * 60 * 60 * 24 * 30,
          )
          this.recipes_list[r].future_prescription_date =
            `${unformatted_future_date.getFullYear()}-${unformatted_future_date.getMonth() + 1}-${unformatted_future_date.getDate()}`

          this.recipes_list[r].last_prescription_dates.push(
            this.recipes_list[r].current_prescription_date,
          )
          this.recipe = this.recipes_list[r]
          localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
          this.goToRecipesView()
          break
        }
      }
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
    showConfirmDeletePopUp() {
      this.showModal = !this.showModal;
    },
    deleteRecipe(){
      let index = this.searchRecipe()
      if (index > -1) {
        this.recipes_list.splice(index, 1)
        localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
        this.goToRecipesView()
      }
    },
    searchRecipe() {
      for (let i = 0; i < this.recipes_list.length; i++) {
        if (this.recipes_list[i].patient.name === this.recipe.patient.name &&
          this.recipes_list[i].doctor.name === this.recipe.doctor.name) {
          return i;
        }
      }
    },
    goToEditRecipe() {
      this.$router.push(
        `/edit_recipe/${this.recipe.patient.name}/${this.recipe.doctor.name}/${this.recipe.doctor.specialization}/${this.recipe.recipe_duration}/${this.recipe.distance_between_prescriptions}/${this.recipe.last_prescription_dates}/${this.recipe.current_prescription_date}/${this.recipe.future_prescription_date}/${this.recipe.status}`,
      )
    },
    updateRecipeDetails() {
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].patient.name === this.recipe.patient.name &&
          this.recipes_list[r].doctor.name === this.recipe.doctor.name) {

        }
      }
    },
  },
}
</script>
<template>
  <div class="more-details-recipe">
    <div class="upper-zone">
      <div class="upper-zone-left">
        <p>Pacient: {{ this.recipe.patient.name }}</p>
        <p>Tip rețetă: {{ this.recipe.doctor.specialization }}</p>
        <p>Doctor: {{ this.recipe.doctor.name }}</p>
        <p>Durata: {{ this.recipe.recipe_duration }}</p>
      </div>
      <div class="upper-zone-right">
        <button
          class="button-update"
          @click="calculateFuturePrescriptionDate"
          v-show="this.recipe.status === '1'"
        >
          Update
        </button>
        <button class="button-delete" @click="showConfirmDeletePopUp">Delete</button>
        <button class="button-edit" @click="goToEditRecipe">Edit</button>
      </div>
    </div>
    <div class="middle-zone">
      <p>Data ultimei rețete prescrise: {{ this.$route.params.current_prescription_date }}</p>
      <p>
        Data următoarei prescrieri: {{ this.formatDate(this.$route.params.future_prescription_date) }}
      </p>
      <p>Rețetele prescrise anterior:</p>
    </div>
    <div class="table-last-dates">
      <p v-for="(index, counter) in this.recipe.last_prescription_dates" :key="index">
        {{ counter + 1 }}. {{ index }}
      </p>
    </div>
    <button @click="goToRecipesView">Back</button>
  </div>

  <div id="delete-confirmation-popUp" class="modal" v-show="showModal === true">
    <div class="modal-content">
      <h2 style="background-color: firebrick; color: white; font-weight: bold;">
        Confirmare ștergere rețetă
      </h2>
      <p style="margin: 20px 2px 20px 2px; color: black">
        Ești sigur că dorești să ștergi această rețetă?
      </p>

      <button class="button-cancel" @click="showConfirmDeletePopUp">Anulează</button>
      <button class="button-confirm-deletion" @click="deleteRecipe">Șterge</button>
    </div>
  </div>

</template>

<style scoped>
* {
  box-sizing: border-box;
}
.more-details-recipe {
  background-color: #fff;
  color: #181818;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
}
.table-last-dates {
  height: 100px;
  width: 80%;
  overflow: auto;
}

.upper-zone {
  display: flex;
  position: relative;
}
.upper-zone-left {
  position: relative;
  flex: 1;
}
.upper-zone-right {
  position: relative;
  text-align: right;
}

button {
  width: 80px;
  height: 33px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 3px;
  border: none;
  opacity: 0.9;
}

button:hover {
  opacity: 1;
}

.button-edit {
  display: block;
  background-color: forestgreen;
}

.button-delete {
  display: block;
  background-color: firebrick;
}

.button-cancel {
  background-color: darkgray;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}

.button-confirm-deletion {
  background-color: firebrick;
  margin-bottom: 20px;
}

#delete-confirmation-popUp {
  text-align: center;
  /*display: none; Hidden by default*/
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  padding-top: 55%;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 80%; /* Could be more or less, depending on screen size */
}
</style>
