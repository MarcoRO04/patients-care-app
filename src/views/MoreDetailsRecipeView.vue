<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import {
  faAngleLeft,
  faEdit, faRotate,
  fas,
  faTrashCan,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import * as byPrefixAndName from '@fortawesome/free-solid-svg-icons'

library.add(fas, far, fab)

export default {
  name: 'MoreDetailRecipe',
  computed: {
  },
  components: { FontAwesomeIcon },
  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes)
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
        future_prescription_date: '',
        current_prescription_date: '',
        recipe_duration: '',
        last_prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
      },
      recipes_list: [],
      showModal: false,
    }
  },
  methods: {
    faRotate() {
      return faRotate
    },
    faXmark() {
      return faXmark
    },
    faAngleLeft() {
      return faAngleLeft
    },
    faTrashCan() {
      return faTrashCan
    },
    faEdit() {
      return faEdit
    },
    initializeRecipe(){
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].id === this.$route.params.id){
          this.recipe.id = this.recipes_list[r].id
          this.recipe.patient.name = this.recipes_list[r].patient.name
          this.recipe.doctor.name = this.recipes_list[r].doctor.name
          this.recipe.doctor.specialization = this.recipes_list[r].doctor.specialization
          this.recipe.recipe_duration = this.recipes_list[r].recipe_duration
          this.recipe.current_prescription_date = this.recipes_list[r].current_prescription_date
          this.recipe.future_prescription_date = this.recipes_list[r].future_prescription_date
          this.recipe.last_prescription_dates = this.recipes_list[r].last_prescription_dates
          this.recipe.status = this.recipes_list[r].status
          this.recipe.distance_between_prescriptions = this.recipes_list[r].distance_between_prescriptions
          break;
        }
      }
    },
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
        if (this.recipes_list[r].id === this.$route.params.id) {
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
        if (this.recipes_list[i].id === this.$route.params.id) {
          return i;
        }
      }
    },
    goToEditRecipe() {
      this.$router.push(
        `/edit_recipe/${this.recipe.id}`,
      )
    },
  },
}
</script>
<template>
  <div class="more-details-recipe">
    <div class="more-details-header">
      <h3 style="font-weight: bold">Detalii rețetă</h3>
      <button class="button-cancel-x" @click="goToRecipesView"><FontAwesomeIcon :icon="faXmark()" /></button>
    </div>
    <div class="upper-zone">
      <div class="upper-zone-left">
        <div class="divs-paragraph-problem">
          <p class="label-problem">Pacient: </p> <p> {{ this.recipe.patient.name }}</p>
        </div>
        <div class="divs-paragraph-problem">
          <p class="label-problem">Tip rețetă:</p> <p>{{ this.recipe.doctor.specialization }}</p>
        </div>
        <div class="divs-paragraph-problem">
          <p class="label-problem">Doctor:</p> <p>{{ this.recipe.doctor.name }}</p>
        </div>
        <div class="divs-paragraph-problem">
          <p class="label-problem">Durata:</p> <p>{{ this.recipe.recipe_duration }}</p>
        </div>
      </div>
      <div class="upper-zone-right">
        <button class="button-update"
          @click="calculateFuturePrescriptionDate"
          v-show="this.recipe.status === '1'"
        >
          <FontAwesomeIcon :icon="faRotate()"></FontAwesomeIcon>Actualizează
        </button>
        <button class="button-delete" @click="showConfirmDeletePopUp"><FontAwesomeIcon :icon="faTrashCan()"></FontAwesomeIcon>Șterge</button>
        <button class="button-edit" @click="goToEditRecipe"><FontAwesomeIcon :icon="faEdit()"></FontAwesomeIcon>Editează</button>
      </div>
    </div>
    <div class="middle-zone">
      <div class="divs-paragraph-problem">
        <p class="label-problem">Data ultimei rețete prescrise:</p> <p>{{ this.recipe.current_prescription_date }}</p>
      </div>
      <div class="divs-paragraph-problem">
        <p class="label-problem" style="margin-bottom: 15px">Data următoarei prescrieri:</p><p>{{ this.formatDate(this.recipe.future_prescription_date) }}</p>
      </div>
      <p class="table-header">Rețetele prescrise anterior:</p>
      <div class="table-last-dates">
        <p style="padding: 0 0 0 10px;" v-for="(index, counter) in this.recipe.last_prescription_dates" :key="index">
          {{ counter + 1 }}. {{ index }}
        </p>
      </div>
      <button class="back-button" @click="goToRecipesView"><FontAwesomeIcon :icon="faAngleLeft()"></FontAwesomeIcon>Înapoi</button>
    </div>
  </div>

  <div id="delete-confirmation-popUp" class="delete-recipe-modal" v-show="showModal === true">
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

/*It didn't let me to do just a part of the paragraph bold, so I did this:*/
/*-----------------------*/
.divs-paragraph-problem{
  display: flex;
  position: relative;
}
.label-problem{
  margin-right: 7px;
  font-weight: bold;
}
/*----------------------*/
.more-details-recipe {
  background-color: #fff;
  color: #181818;
  width: 100%;
  height: 100%;
}

.more-details-header{
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
  height: 25px;
  text-align: right;
  margin-left: auto;
}
.table-last-dates {
  height: 120px;
  width: 100%;
  overflow: auto;
  border: 1px solid #181818;
  margin-bottom: 30px;
  padding-top: 5px;
}

.table-header{
  height: 30px;
  width: 100%;
  background-color: #cf2e2e;
  color: white;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 5px;
  font-weight: bold;
  border-bottom: none;
  border-left: 1px solid #181818;
  border-right: 1px solid #181818;
  border-top: 1px solid #181818;
}

.upper-zone {
  display: flex;
  position: relative;
  padding: 10px 15px;
}
.upper-zone-left {
  position: relative;
  flex: 1;
}
.upper-zone-right {
  position: relative;
  text-align: right;
}

.middle-zone{
  padding: 10px 15px;
}

button {
  width: 115px;
  height: 36px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
  opacity: 0.85;
}

button:hover {
  opacity: 1;
}

.button-update{
  border: none;
  display: block;
}

.button-edit {
  background-color: forestgreen;
  display: block;
  border: none;
}

.button-delete {
  background-color: #cf2e2e;
  display: block;
  border: none;
}

.button-cancel {
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}

.button-confirm-deletion {
  background-color: #cf2e2e;
  margin-bottom: 20px;
  border: none;
}

.back-button {
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
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
  padding-top: 200px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 80%; /* Could be more or less, depending on screen size */
}

</style>
